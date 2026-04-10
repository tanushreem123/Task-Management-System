"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { authApi, tasksApi } from "@/lib/api";
import type { Task, TaskStatus, User } from "@/types";

type FilterType = "All" | TaskStatus;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    if (filter === "All") {
      return tasks;
    }
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const fetchTasks = async () => {
    const data = await tasksApi.list();
    setTasks(data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await authApi.me();
        setUser(response.user);
      } catch {
        router.push("/login");
        return;
      }

      try {
        await fetchTasks();
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [router]);

  const handleTaskSubmit = async (payload: { title: string; description: string }) => {
    try {
      setError("");
      if (editingTask) {
        await tasksApi.update(editingTask._id, payload);
        setEditingTask(null);
      } else {
        await tasksApi.create(payload);
      }
      await fetchTasks();
    } catch {
      setError("Failed to save task");
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      setError("");
      await tasksApi.update(task._id, { status: nextStatus });
      await fetchTasks();
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const shouldDelete = window.confirm("Delete this task?");
    if (!shouldDelete) {
      return;
    }

    try {
      setError("");
      await tasksApi.remove(taskId);
      if (selectedTask?._id === taskId) {
        setSelectedTask(null);
      }
      await fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleViewTask = async (taskId: string) => {
    try {
      setError("");
      const task = await tasksApi.getOne(taskId);
      setSelectedTask(task);
    } catch {
      setError("Failed to fetch task details");
    }
  };

  const handleStartEdit = async (taskId: string) => {
    try {
      setError("");
      const task = await tasksApi.getOne(taskId);
      setEditingTask(task);
      setSelectedTask(null);
    } catch {
      setError("Failed to load task for editing");
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/login");
      router.refresh();
    } catch {
      setError("Failed to logout");
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-500 p-6 text-white shadow-xl shadow-cyan-900/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-cyan-100">Task Management App</p>
            <h1 className="text-2xl font-semibold">Welcome, {user?.email || "User"}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/25"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <TaskForm
          onSubmit={handleTaskSubmit}
          initialTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-3 md:justify-self-end">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Filter</p>
          <div className="flex flex-wrap gap-2">
            {(["All", "Pending", "Completed"] as FilterType[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  filter === value
                    ? "bg-cyan-600 text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      <section className="mt-5">
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteTask}
          onStartEdit={handleStartEdit}
          onView={handleViewTask}
        />
      </section>

      {selectedTask ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          onClick={() => setSelectedTask(null)}
        >
          <section
            className="w-full max-w-lg rounded-2xl border border-indigo-200 bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-semibold text-indigo-900">Task Details (GET /tasks/:id)</h2>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-900">
              <span className="font-semibold">Title:</span> {selectedTask.title}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900">
              <span className="font-semibold">Description:</span> {selectedTask.description || "No description"}
            </p>
            <p className="mt-2 text-sm text-slate-900">
              <span className="font-semibold">Status:</span> {selectedTask.status}
            </p>
            <p className="mt-2 break-all text-xs text-slate-700">
              <span className="font-semibold">Task ID:</span> {selectedTask._id}
            </p>
          </section>
        </div>
      ) : null}
    </main>
  );
}
