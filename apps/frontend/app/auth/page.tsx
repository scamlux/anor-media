"use client";

import { LoginForm } from "@/components/forms/LoginForm";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function AuthPage() {
  const authActions = useAuthActions();

  return (
    <div className="mx-auto mt-24 max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Sign in</h2>
      <LoginForm
        isLoading={authActions.isLoading}
        error={authActions.error}
        onSubmit={async (values) => {
          await authActions.signIn(values);
        }}
      />
    </div>
  );
}
