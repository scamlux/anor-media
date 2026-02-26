import { api } from "./api";
import type { LoginResponse } from "@/types/api";

export async function login(payload: { email: string; password: string }): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function me(): Promise<LoginResponse> {
  const response = await api.get<LoginResponse>("/auth/me");
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
