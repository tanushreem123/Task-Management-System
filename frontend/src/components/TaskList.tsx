"use client";

import type { Task, TaskStatus } from "@/types";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleStatus: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onStartEdit: (taskId: string) => Promise<void>;
  onView: (taskId: string) => Promise<void>;
}

const badgeClass: Record<TaskStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function TaskList({
  tasks,
  loading,
  onToggleStatus,
  onDelete,
  onStartEdit,
  onView,
}: TaskListProps) {
  if (loading) {
    return <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">Loading tasks...</p>;
  }

  if (!tasks.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
        No tasks found for this filter.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{task.description || "No description"}</p>
              <span
                className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass[task.status]}`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onView(task._id)}
                className="rounded-xl border border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(task)}
                className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {task.status === "Completed" ? "Mark Pending" : "Mark Completed"}
              </button>
              <button
                type="button"
                onClick={() => onStartEdit(task._id)}
                className="rounded-xl border border-cyan-300 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(task._id)}
                className="rounded-xl border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
