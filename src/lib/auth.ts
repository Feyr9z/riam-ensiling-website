import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sessionOptions, SessionData, defaultSession } from "./session";

/**
 * Retrieves the current admin session from HTTP-only cookies.
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

/**
 * Authenticates an admin against stored database credentials.
 */
export async function authenticateAdmin(email: string, passwordPlain: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!admin) {
    return { success: false, error: "Email atau kata sandi tidak valid" };
  }

  const isPasswordValid = await bcrypt.compare(passwordPlain, admin.passwordHash);
  if (!isPasswordValid) {
    return { success: false, error: "Email atau kata sandi tidak valid" };
  }

  const session = await getAdminSession();
  session.adminId = admin.id;
  session.email = admin.email;
  session.isLoggedIn = true;
  await session.save();

  return { success: true, admin: { id: admin.id, email: admin.email } };
}

/**
 * Destroys the current admin session cookie.
 */
export async function destroyAdminSession() {
  const session = await getAdminSession();
  session.destroy();
}
