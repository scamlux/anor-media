"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export function LoginForm({ isLoading, error, onSubmit }: LoginFormProps) {
  const { register, handleSubmit } = useForm<LoginFormValues>();

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <Input {...register("email", { required: true })} type="email" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <Input {...register("password", { required: true })} type="password" />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
