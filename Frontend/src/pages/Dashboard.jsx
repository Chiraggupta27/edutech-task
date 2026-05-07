import { useEffect, useMemo, useReducer, useRef } from "react";
import { useDispatch } from "react-redux";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar/Navbar.jsx";
import TaskForm from "../components/TaskForm/TaskForm.jsx";
import TaskCard from "../components/TaskCard/TaskCard.jsx";
import ConfirmModal from "../components/Modal/ConfirmModal.jsx";
import ToastHost from "../components/Toast/ToastHost.jsx";
import Loader from "../components/Loader/Loader.jsx";
import useDebouncedValue from "../utils/useDebouncedValue.js";
import { toast } from "../features/ui/uiSlice.js";
import {
  tasksKey,
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateStatus,
  useUpdateTask
} from "../features/tasks/taskQueries.js";
import "../pages/dashboard.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" }
];

const initialUI = {
  filter: "all",
  search: "",
  page: 1,
  editing: null,
  confirmDeleteTask: null
};

function uiReducer(state, action) {
  switch (action.type) {
    case "setFilter":
      return { ...state, filter: action.value };
    case "setSearch":
      return { ...state, search: action.value };
    case "setPage":
      return { ...state, page: action.value };
    case "resetPage":
      return { ...state, page: 1 };
    case "startEdit":
      return { ...state, editing: action.task };
    case "cancelEdit":
      return { ...state, editing: null };
    case "askDelete":
      return { ...state, confirmDeleteTask: action.task };
    case "closeDelete":
      return { ...state, confirmDeleteTask: null };
    default:
      return state;
  }
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const qc = useQueryClient();

  const [ui, uiDispatch] = useReducer(uiReducer, initialUI);
  const debouncedSearch = useDebouncedValue(ui.search, 350);

  const query = useMemo(() => {
    const params = { page: ui.page, limit: 8 };
    if (ui.filter !== "all") params.status = ui.filter;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    return params;
  }, [ui.filter, ui.page, debouncedSearch]);

  const onToast = (payload) => dispatch(toast(payload));

  const tasksQuery = useTasks(query);
  const createTask = useCreateTask(onToast);
  const updateTask = useUpdateTask(onToast);
  const deleteTask = useDeleteTask(onToast);
  const updateStatus = useUpdateStatus(onToast);

  const data = tasksQuery.data || { tasks: [], pagination: { page: 1, total: 0, totalPages: 1 } };
  const items = data.tasks || [];
  const pagination = data.pagination || { page: 1, total: 0, totalPages: 1 };
  const isLoading = tasksQuery.isLoading;
  const error = tasksQuery.isError;

  useEffect(() => {
    uiDispatch({ type: "resetPage" });
  }, [ui.filter, debouncedSearch]);

  const onCreate = (values, done) => {
    createTask.mutate(values, {
      onSuccess: (res) => {
        const created = res?.data?.task;
        if (created && pagination.page === 1) {
          qc.setQueryData(tasksKey(query), (old) => {
            if (!old || !old.tasks || !old.pagination) return old;
            return {
              ...old,
              tasks: [created, ...old.tasks].slice(0, old.pagination.limit || old.tasks.length),
              pagination: {
                ...old.pagination,
                total: typeof old.pagination.total === "number" ? old.pagination.total + 1 : old.pagination.total
              }
            };
          });
        }
        done();
      }
    });
  };

  const onEdit = (task) => {
    uiDispatch({ type: "startEdit", task });
  };

  const onSaveEdit = (values) => {
    updateTask.mutate(
      { id: ui.editing._id, payload: values },
      {
        onSuccess: () => {
          uiDispatch({ type: "cancelEdit" });
        }
      }
    );
  };

  const onCancelEdit = () => {
    uiDispatch({ type: "cancelEdit" });
  };

  const onAskDelete = (task) => {
    uiDispatch({ type: "askDelete", task });
  };

  const onConfirmDelete = () => {
    const task = ui.confirmDeleteTask;
    if (!task) return;
    deleteTask.mutate(task._id, {
      onSettled: () => {
        uiDispatch({ type: "closeDelete" });
      }
    });
  };

  const onToggle = (task) => {
    const next = task.status === "completed" ? "pending" : "completed";
    updateStatus.mutate({ id: task._id, status: next });
  };

  const canPrev = ui.page > 1;
  const canNext = ui.page < (pagination.totalPages || 1);

  const parentRef = useRef(null);
  const listPad = 12;
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 170,
    overscan: 6
  });

  const isEditing = Boolean(ui.editing);
  const confirmOpen = Boolean(ui.confirmDeleteTask);
  const deleteLoading = deleteTask.isPending;

  return (
    <>
      <ToastHost />
      <Navbar />
      <div className="container dashWrap">
        <div className="dashTop">
          <div>
            <div className="dashTitle">Your tasks</div>
            <div className="muted dashSub">Create, update, and track progress.</div>
          </div>

          <div className="controls">
            <input
              className="input searchInput"
              placeholder="Search tasks..."
              value={ui.search}
              onChange={(e) => uiDispatch({ type: "setSearch", value: e.target.value })}
            />
            <div className="filterGroup" role="tablist" aria-label="Task status filter">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={ui.filter === f.id}
                  className={`filterChip ${ui.filter === f.id ? "filterChipActive" : ""}`}
                  onClick={() => uiDispatch({ type: "setFilter", value: f.id })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          <div>
            <TaskForm
              mode={isEditing ? "edit" : "create"}
              initialValues={ui.editing}
              onSubmit={isEditing ? onSaveEdit : onCreate}
              onCancel={onCancelEdit}
              loading={false}
            />
          </div>

          <div className="rightCol">
            <div className="listCard card">
              <div className="listHead">
                <div>
                  <div className="listTitle">Task list</div>
                  <div className="muted listSub">{pagination.total} total</div>
                </div>
              </div>

              {isLoading ? (
                <>
                  <Loader label="Fetching tasks..." />
                  <div className="taskGrid skWrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="card skCard">
                        <div className="skeleton skH14" />
                        <div className="sp10" />
                        <div className="skeleton skL12a" />
                        <div className="sp8" />
                        <div className="skeleton skL12b" />
                        <div className="sp14" />
                        <div className="skeleton skBtn" />
                      </div>
                    ))}
                  </div>
                </>
              ) : items.length ? (
                <>
                  <div
                    ref={parentRef}
                    className="taskVirtualWrap"
                    style={{ overflow: "auto" }}
                  >
                    <div
                      style={{
                        height: rowVirtualizer.getTotalSize() + listPad * 2,
                        width: "100%",
                        position: "relative"
                      }}
                    >
                      {rowVirtualizer.getVirtualItems().map((row) => {
                        const t = items[row.index];
                        return (
                          <div
                            key={t._id}
                            data-index={row.index}
                            ref={rowVirtualizer.measureElement}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              transform: `translateY(${row.start + listPad}px)`,
                              paddingBottom: 12
                            }}
                          >
                            <TaskCard
                              task={t}
                              onEdit={onEdit}
                              onDelete={onAskDelete}
                              onToggle={onToggle}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pagination">
                    <div className="muted pageInfo">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="paginationBtns">
                      <button
                        type="button"
                        className="btn"
                      onClick={() => uiDispatch({ type: "setPage", value: Math.max(ui.page - 1, 1) })}
                        disabled={!canPrev}
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        className="btn"
                      onClick={() => uiDispatch({ type: "setPage", value: ui.page + 1 })}
                        disabled={!canNext}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="emptyState">
                  <div className="emptyTitle">No tasks found</div>
                  <div className="muted emptySub">
                    {error
                      ? "We couldn’t load tasks. Please try again."
                      : "Create your first task using the form on the left."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete task?"
        message={`This will permanently delete “${ui.confirmDeleteTask?.title || "this task"}”.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger
        loading={deleteLoading}
        onClose={() => {
          if (deleteLoading) return;
          uiDispatch({ type: "closeDelete" });
        }}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}

