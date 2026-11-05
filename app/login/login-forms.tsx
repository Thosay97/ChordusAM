"use client";

import { useActionState, useState } from "react";
import { sendMagicLink, signInWithPassword, type LoginState } from "./actions";

const input =
  "w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20";
const button =
  "w-full rounded-md bg-burgundy px-3 py-2 text-sm font-semibold text-white hover:bg-burgundy-700 disabled:opacity-60";

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
    <div className="space-y-4">
      {mode === "magic" ? (
        <form action={magicAction} className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
          />
          <button type="submit" disabled={magicPending} className={button}>
            {magicPending ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      ) : (
        <form action={pwAction} className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="pw-email">
            Email
          </label>
          <input
            id="pw-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
          />
          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={input}
          />
          <button type="submit" disabled={pwPending} className={button}>
            {pwPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.message && <p className="text-brand-green text-sm">{state.message}</p>}

      <button
        type="button"
        onClick={() => setMode(mode === "magic" ? "password" : "magic")}
        className="text-burgundy text-sm underline underline-offset-2"
      >
        {mode === "magic" ? "Sign in with a password instead" : "Use a magic link instead"}
      </button>
    </div>
  );
}
