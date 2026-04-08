import type { Context } from "hono";
import { loginDto, registerDto } from "../Dtos/auth.js";
import { getDB } from "../db/index.js";
import { logTable, sessionsTable, userTable } from "../db/schema.js";
import { and, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getCookie, setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

export const NODE_ENV = process.env.NODE_ENV?.toUpperCase() === "PRODUCTION";

export const cookieConfigs = (maxAge: number) => {
  return {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
    maxAge: maxAge,
    path: "/",
  } as const;
};

/**
 * Description
 * @param {any} c:Context
 * @returns {any}
 */

export const register = async (c: Context) => {
  try {
    const parsedData = registerDto.parse(await c.req.json());
    if (parsedData.password !== parsedData.confirmPassword) {
      return c.json({ error: "Passwords do not match" }, 400);
    }

    const db = getDB();

    const existingUser = await db
      .select()
      .from(userTable)
      .where(
        or(
          eq(userTable.username, parsedData.username),
          eq(userTable.email, parsedData.email),
        ),
      )
      .execute();

    if (existingUser.length > 0) {
      return c.json({ error: "Username or email already exists" }, 400);
    }

    const passwordHash = await bcrypt.hash(parsedData.password, 10);
    const newUser = await db
      .insert(userTable)
      .values({
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        username: parsedData.username,
        email: parsedData.email,
        passwordHash: passwordHash,
      })
      .returning();


    await db
      .insert(logTable)
      .values({
        userId: newUser[0].id,
        action: "User registered",
      })
      .execute();

    return c.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser[0].id,
          firstName: newUser[0].firstName,
          lastName: newUser[0].lastName,
          username: newUser[0].username,
          email: newUser[0].email,
        },
      },
      201,
    );
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      400,
    );
  }
};


/**
 * Description
 * @param {any} c:Context
 * @returns {any}
 */

export const login = async (c: Context) => {
  try {
    const parseData = loginDto.parse(await c.req.json());
    const db = getDB();

    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, parseData.email))
      .execute();



    if (user.length === 0) {
      return c.json({ error: "Invalid email or password" }, 400);
    }

    const validPassword = await bcrypt.compare(
      parseData.password,
      user[0].passwordHash,
    );

    if (!validPassword) {
      return c.json({ error: "Invalid email or password" }, 400);
    }

    const secret = {
      access: process.env.JWT_ACCESS_SECRET as string,
      refresh: process.env.JWT_REFRESH_SECRET as string,
    };
    if (!secret.access || !secret.refresh) {
      return c.json({ error: "JWT secret is not defined" }, 500);
    }

    const accessToken = await jwt.sign(
      { userId: user[0].id, username: user[0].username, role: user[0].role },
      secret.access,
      { expiresIn: "1h" },
    );

    const refreshToken = await jwt.sign(
      { userId: user[0].id, username: user[0].username, role: user[0].role },
      secret.refresh,
      { expiresIn: "7d" },
    );


    setCookie(c, "accessToken", accessToken, cookieConfigs(15 * 60)); //15 minutes expires in seconds
    setCookie(c, "refreshToken", refreshToken, cookieConfigs(7 * 24 * 60 * 60)); //7 days expires in seconds

    await db
      .insert(sessionsTable)
      .values({
        userId: user[0].id,
        refreshToken: refreshToken,
        accessToken: accessToken,
        userAgent: c.req.header("user-agent") || "Unknown",
        ipAddress:
          c.req.header("x-forwarded-for") ||
          c.req.header("remote-addr") ||
          "Unknown",
      })
      .execute();

    await db
      .insert(logTable)
      .values({
        userId: user[0].id,
        action: "User logged in " + new Date().toISOString(),
      })
      .execute();

    return c.json({
      message: "Login successful",
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
      },
    });
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      400,
    );
  }
};

/**
 * Description
 * @param {any} c:Context
 * @returns {any}
 */
export const logout = async (c: Context) => {
  const db = getDB();
  const rt = getCookie(c, "refreshToken");
  const at = getCookie(c, "accessToken");
  if (!rt || !at) {
    return c.json({ error: "Tokens not found" }, 400);
  }
  await db
    .delete(sessionsTable)
    .where(
      and(
        eq(sessionsTable.refreshToken, rt),
        eq(sessionsTable.accessToken, at),
      ),
    )
    .execute();
  setCookie(c, "accessToken", "", cookieConfigs(0));
  setCookie(c, "refreshToken", "", cookieConfigs(0));
  return c.json({ message: "Logout successful" });
};

/**
 * Description
 * @param {any} c:Context
 * @returns {any}
 */
export const refreshToken = async (c: Context) => {
  const refreshToken = getCookie(c, "refreshToken");
  const secret = {
    access: process.env.JWT_ACCESS_SECRET as string,
    refresh: process.env.JWT_REFRESH_SECRET as string,
  };
  if (!refreshToken) {
    return c.json({ error: "Refresh token not found" }, 400);
  }

  if (!secret.refresh) {
    return c.json({ error: "JWT refresh secret is not defined" }, 500);
  }

  try {
    const decoded = jwt.verify(refreshToken, secret.refresh) as {
      userId: number;
      username: string;
      role: string;
    };
    const db = getDB();
    const session = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.refreshToken, refreshToken))
      .execute();

    if (session.length === 0) {
      return c.json({ error: "Invalid refresh token" }, 400);
    }

    const newAccessToken = await jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
      secret.access,
      { expiresIn: "1h" },
    );

    const newRefreshToken = await jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
      secret.refresh,
      { expiresIn: "7d" },
    );

    await db
      .update(sessionsTable)
      .set({ refreshToken: newRefreshToken, accessToken: newAccessToken })
      .where(and(eq(sessionsTable.refreshToken, refreshToken)))
      .execute();

    setCookie(c, "accessToken", newAccessToken, cookieConfigs(15 * 60)); //15 minutes expires in seconds
    setCookie(
      c,
      "refreshToken",
      newRefreshToken,
      cookieConfigs(7 * 24 * 60 * 60),
    ); //7 days expires in seconds

    return c.json({ message: "Access token refreshed" });
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      400,
    );
  }
};


