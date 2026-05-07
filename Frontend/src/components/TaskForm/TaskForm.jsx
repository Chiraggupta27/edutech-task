import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import "./taskForm.css";

export default function TaskForm({
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  loading = false
}) {
  const submitIntentRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      description: ""
    }
  });

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      reset({
        title: initialValues.title || "",
        description: initialValues.description || ""
      });
    } else {
      reset({ title: "", description: "" });
    }
  }, [mode, initialValues, reset]);

  const onValidatedSubmit = (values) => {
    if (!submitIntentRef.current) return;
    onSubmit(values, () => reset({ title: "", description: "" }));
  };

  return (
    <form
      className="taskForm card"
      onKeyDownCapture={() => {
        submitIntentRef.current = true;
      }}
      onPointerDownCapture={() => {
        submitIntentRef.current = true;
      }}
      onSubmit={handleSubmit(onValidatedSubmit)}
    >
      <div className="taskFormHead">
        <div>
          <div className="taskFormTitle">
            {mode === "edit" ? "Edit task" : "Create new task"}
          </div>
          <div className="muted taskFormSub">
            Keep tasks small, clear, and actionable.
          </div>
        </div>
        {mode === "edit" ? (
          <button type="button" className="btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        ) : null}
      </div>

      <div className="taskFormBody">
        <label className="label">Title</label>
        <input
          className="input"
          placeholder="e.g. Finish CRUD APIs"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? <div className="errorText">{errors.title.message}</div> : null}

        <div className="sp12" />

        <label className="label">Description (optional)</label>
        <textarea
          className="input textarea"
          placeholder="Add a short description..."
          {...register("description")}
        />
      </div>

      <div className="taskFormActions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : mode === "edit" ? "Save changes" : "Add task"}
        </button>
      </div>
    </form>
  );
}

