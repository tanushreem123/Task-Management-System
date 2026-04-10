"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setError("");
      await authApi.login(email, password);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message.includes("401") ? "Invalid credentials" : "Unable to login");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-10 sm:px-6">
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        title="Welcome back"
        subtitle="Login to manage your tasks"
        submitText="Login"
        error={error}
      />
      <p className="mt-4 text-center text-sm text-slate-600">
        No account?{" "}
        <Link href="/register" className="font-medium text-cyan-700 hover:text-cyan-800">
          Register here
        </Link>
      </p>
    </main>
  );
}
