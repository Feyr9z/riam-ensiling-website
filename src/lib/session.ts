import { SessionOptions } from "iron-session";

export interface SessionData {
  adminId?: string;
  email?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.ADMIN_SESSION_SECRET ||
    "fallback_secret_must_be_at_least_32_characters_long_for_security",
  cookieName: "riam_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
