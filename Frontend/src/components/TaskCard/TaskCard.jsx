import "./taskCard.css";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle
}) {
  const isCompleted = task.status === "completed";

  return (
    <div className={`taskCard card ${isCompleted ? "taskCardDone" : ""}`}>
      <div className="taskTop">
        <div className="taskTitleRow">
          <div className="taskTitle">{task.title}</div>
          <div className={`taskBadge ${isCompleted ? "badgeDone" : "badgePending"}`}>
            {isCompleted ? "Completed" : "Pending"}
          </div>
        </div>
        {task.description ? (
          <div className="taskDesc muted">{task.description}</div>
        ) : (
          <div className="taskDesc muted">No description</div>
        )}
      </div>

      <div className="taskActions">
        <button type="button" className="btn" onClick={() => onToggle(task)}>
          {isCompleted ? "Mark Pending" : "Mark Complete"}
        </button>
        <button type="button" className="btn" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </div>
  );
}

