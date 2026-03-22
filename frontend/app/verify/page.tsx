"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const OTP_DURATION_SEC = 5 * 60;
const RESEND_COOLDOWN_SEC = 60;

function formatMmSs(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [remainingSec, setRemainingSec] = useState(OTP_DURATION_SEC);
  const [resendInSec, setResendInSec] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorBump, setErrorBump] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemainingSec((s) => Math.max(0, s - 1));
      setResendInSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      setErrorBump((k) => k + 1);
      return;
    }
    if (remainingSec <= 0) {
      setError("This code has expired. Resend a new code.");
      setErrorBump((k) => k + 1);
      return;
    }
    console.log("✅ OTP verified:", code);
    console.log()

    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      router.replace("/chat");
    }, 500);
  }

  function handleResend() {
    if (resendLoading || resendInSec > 0) return;
    setError(null);
    setResendLoading(true);
    window.setTimeout(() => {
      setRemainingSec(OTP_DURATION_SEC);
      setResendInSec(RESEND_COOLDOWN_SEC);
      setOtp("");
      setResendLoading(false);
    }, 450);
  }

  const expired = remainingSec <= 0;
  const canResend = resendInSec <= 0 && !resendLoading;

  return (
    <>
      <div className="auth-ambient" aria-hidden />
      <main className="auth-shell relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="auth-panel auth-card w-full max-w-md space-y-8 rounded-2xl border p-8 backdrop-blur-md">
          <div className="auth-stagger-1 space-y-2 text-center">
            <h1 className="auth-heading text-2xl font-semibold tracking-tight">
              Verify your email
            </h1>
            <p className="auth-muted text-sm">
              We sent a 6-digit code to your inbox. Enter it below to continue.
            </p>
          </div>

          <form onSubmit={handleVerify} className="auth-stagger-2 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="auth-label block text-sm font-medium"
              >
                One-time code
              </label>
              <input
                id="otp"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="auth-input w-full rounded-xl border px-4 py-3 text-center font-mono text-lg tracking-[0.4em] outline-none transition-[transform] duration-200 focus:outline-none enabled:active:scale-[0.998]"
                disabled={loading}
              />
            </div>

            <div className="flex min-h-12 flex-col justify-center gap-1 text-center text-sm transition-opacity duration-300">
              {expired ? (
                <p className="auth-warning font-medium">
                  This code has expired. Request a new one below.
                </p>
              ) : (
                <p className="auth-muted">
                  Expires in{" "}
                  <span className="auth-timer-strong tabular-nums">
                    {formatMmSs(remainingSec)}
                  </span>
                </p>
              )}
            </div>

            {error ? (
              <p
                key={errorBump}
                className={`auth-error text-center text-sm ${errorBump ? "auth-error-shake" : ""}`}
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || expired}
              className="auth-btn-primary w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-[transform,opacity] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Continue"}
            </button>
          </form>

          <div className="auth-stagger-3 auth-divider flex flex-col gap-3 border-t pt-6">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className="auth-btn-secondary rounded-xl border px-4 py-3 text-sm font-semibold transition-[transform] duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {resendLoading
                ? "Sending…"
                : resendInSec > 0
                  ? `Resend OTP in ${resendInSec}s`
                  : "Resend OTP"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="auth-link text-center text-sm font-medium transition-colors duration-200"
            >
              Use a different email
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
