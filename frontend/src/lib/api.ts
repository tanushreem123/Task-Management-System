import axios from "axios";
import type { AuthResponse, Task, TaskStatus } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", { email, password });
    return response.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    return response.data;
  },
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  },
  me: async (): Promise<{ user: { id: string; email: string } }> => {
    const response = await api.get<{ user: { id: string; email: string } }>("/auth/me");
    return response.data;
  },
};

export const tasksApi = {
  list: async (status?: TaskStatus): Promise<Task[]> => {
    const response = await api.get<Task[]>("/tasks", {
      params: status ? { status } : undefined,
    });
    return response.data;
  },
  getOne: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  create: async (payload: { title: string; description?: string }): Promise<Task> => {
    const response = await api.post<Task>("/tasks", payload);
    return response.data;
  },
  update: async (
    id: string,
    payload: { title?: string; description?: string; status?: TaskStatus }
  ): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, payload);
    return response.data;
  },
  remove: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },
};
