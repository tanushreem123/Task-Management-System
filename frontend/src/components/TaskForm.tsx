"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types";

interface TaskFormProps {
  onSubmit: (payload: { title: string; description: string }) => Promise<void>;
  initialTask?: Task | null;
  onCancelEdit?: () => void;
}

export default function TaskForm({ onSubmit, initialTask, onCancelEdit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      return;
    }
    setTitle("");
    setDescription("");
  }, [initialTask]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      if (!initialTask) {
        setTitle("");
        setDescription("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{initialTask ? "Edit task" : "Add a task"}</h2>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        type="text"
        required
        maxLength={120}
        placeholder="Task title"
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={1000}
        rows={3}
        placeholder="Description (optional)"
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-400"
        >
          {submitting ? "Saving..." : initialTask ? "Update task" : "Add task"}
        </button>
        {initialTask && onCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
