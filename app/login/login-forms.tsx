"use client";

import { useActionState, useState } from "react";
import { sendMagicLink, signInWithPassword, type LoginState } from "./actions";

export function LoginForms() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [magicState, magicAction, magicPending] = useActionState<LoginState, FormData>(
    sendMagicLink,
    {},
  );
  const [pwState, pwAction, pwPending] = useActionState<LoginState, FormData>(
    signInWithPassword,
    {},
  );
  const state = mode === "magic" ? magicState : pwState;

  return (
    <div className="space-y-5">
      {mode === "magic" ? (
        <form action={magicAction} className="space-y-5">
          <div>
            <label className="field-label" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@alliancemedia.lk"
              className="field-input"
            />
          </div>
          <button type="submit" disabled={magicPending} className="btn btn-gold w-full">
            {magicPending ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      ) : (
        <form action={pwAction} className="space-y-5">
          <div>
            <label className="field-label" htmlFor="pw-email">
              Email
            </label>
            <input
              id="pw-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@alliancemedia.lk"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field-input"
            />
          </div>
          <button type="submit" disabled={pwPending} className="btn btn-gold w-full">
            {pwPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}

      {state.error && (
        <p role="alert" className="msg msg-err">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="msg msg-ok">
          {state.message}
        </p>
      )}

      <button
        type="button"
        onClick={() => setMode(mode === "magic" ? "password" : "magic")}
        className="text-soft-gold hover:text-gold block w-full text-center text-sm underline underline-offset-4"
      >
        {mode === "magic" ? "Sign in with a password instead" : "Use a magic link instead"}
      </button>
    </div>
  );
}
