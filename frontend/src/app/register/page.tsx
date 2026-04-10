"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (email: string, password: string) => {
    try {
      setError("");
      await authApi.register(email, password);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message.includes("409") ? "Email already exists" : "Unable to register");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-10 sm:px-6">
      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        title="Create account"
        subtitle="Register and start managing tasks"
        submitText="Register"
        error={error}
      />
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-cyan-700 hover:text-cyan-800">
          Login here
        </Link>
      </p>
    </main>
  );
}
