"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export async function autenticar(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou senha inválidos.";
    }
    throw error;
  }
}

export async function sair() {
  await signOut({ redirectTo: "/" });
}
