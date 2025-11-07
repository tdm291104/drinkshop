import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { UserWithoutPassword } from "@/types/user.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TOKEN_NAME = "user_session";

export function setToken(token: UserWithoutPassword) {
  Cookies.set(TOKEN_NAME, JSON.stringify(token), {
    expires: 1,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

export function getToken(): UserWithoutPassword | null {
  const token = Cookies.get(TOKEN_NAME);
  return token ? JSON.parse(token) : null;
}

export function removeToken() {
  Cookies.remove(TOKEN_NAME);
}
