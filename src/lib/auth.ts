import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

const ADMIN_COOKIE = "shoe-mafia-admin-token";
const USER_COOKIE = "shoe-mafia-user-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface JWTPayload {
  sub: string;
  role: "admin" | "customer";
  email?: string;
  username?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(
  token: string,
  role: "admin" | "customer"
): Promise<void> {
  const cookieStore = await cookies();
  const name = role === "admin" ? ADMIN_COOKIE : USER_COOKIE;
  cookieStore.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAuthCookie(role: "admin" | "customer"): Promise<void> {
  const cookieStore = await cookies();
  const name = role === "admin" ? ADMIN_COOKIE : USER_COOKIE;
  cookieStore.delete(name);
}

export async function getAdminSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function getUserSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "customer") return null;
  return payload;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireUser(): Promise<JWTPayload> {
  const session = await getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envUsername || !envPassword) {
    return { success: false, error: "Admin credentials not configured" };
  }

  if (username !== envUsername || password !== envPassword) {
    return { success: false, error: "Invalid credentials" };
  }

  let admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) {
    const passwordHash = await hashPassword(password);
    admin = await prisma.admin.create({
      data: { username, passwordHash, name: "Admin" },
    });
  } else {
    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid credentials" };
    }
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });
  }

  const token = await createToken({
    sub: admin.id,
    role: "admin",
    username: admin.username,
  });

  await prisma.session.create({
    data: {
      adminId: admin.id,
      token,
      expiresAt: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "LOGIN",
      entity: "admin",
      entityId: admin.id,
    },
  });

  return { success: true, token };
}

export async function authenticateCustomer(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { customer: true },
  });

  if (!user || !user.isActive) {
    return { success: false, error: "Invalid credentials" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid credentials" };
  }

  const token = await createToken({
    sub: user.id,
    role: "customer",
    email: user.email,
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
    },
  });

  return { success: true, token };
}

export async function registerCustomer(data: {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}): Promise<{ success: boolean; token?: string; error?: string }> {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      role: "CUSTOMER" as UserRole,
      customer: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          carts: { create: {} },
        },
      },
    },
    include: { customer: true },
  });

  const token = await createToken({
    sub: user.id,
    role: "customer",
    email: user.email,
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
    },
  });

  return { success: true, token };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const envPassword = process.env.ADMIN_PASSWORD;
  return envPassword === password;
}
