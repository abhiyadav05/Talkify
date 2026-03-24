"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorBump, setErrorBump] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      setErrorBump((k) => k + 1);
      return;
    }

    setLoading(true);
    window.setTimeout(async () => {
      setLoading(false);
      try {
        const { data } = await axios.post(
          `http://localhost:3001/api/v1/login`,
          { email },
        );
        alert(data.message);
        router.push(`verify?email=${email}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || error.message);
        } else {
          alert("Unexpected error");
        }
      }
    }, 450);
  }

  return (
    <>
      <div className="auth-ambient" aria-hidden />
      <main className="auth-shell relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="auth-panel auth-card w-full max-w-md space-y-8 rounded-2xl border p-8 backdrop-blur-md">
          <div className="auth-stagger-1 space-y-2 text-center">
            <h1 className="auth-heading text-2xl font-semibold tracking-tight">
              Sign in
            </h1>
            <p className="auth-muted text-sm">
              Enter your email. We&apos;ll send a one-time code to sign you in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-stagger-2 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="auth-label block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="auth-input w-full rounded-xl border px-4 py-3 text-sm outline-none transition-[transform] duration-200 focus:outline-none enabled:active:scale-[0.998]"
                disabled={loading}
              />
            </div>

            {error ? (
              <p
                key={errorBump}
                className={`auth-error text-sm ${errorBump ? "auth-error-shake" : ""}`}
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="auth-btn-primary w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-[transform,opacity] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={`inline-block transition-opacity duration-200 ${loading ? "opacity-80" : "opacity-100"}`}
              >
                {loading ? "Sending…" : "Send OTP"}
              </span>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
