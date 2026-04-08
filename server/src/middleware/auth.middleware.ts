import type { Context, Next } from "hono"
import { getDB } from "../db/index.js"
import { sessionsTable, userTable } from "../db/schema.js"
import { eq } from "drizzle-orm"
import { getCookie } from "hono/cookie"

export const authMiddleware = async (c: Context, next: Next) => {
    const accessToken = getCookie(c, "accessToken")
    if (!accessToken) {
        console.log("Auth Middleware: No access token found in cookies")
        return c.json({ error: "Not authenticated" }, 401)
    }

    const db = getDB()
    const session = await db
        .select()
        .from(sessionsTable)
        .leftJoin(userTable, eq(sessionsTable.userId, userTable.id))
        .where(eq(sessionsTable.accessToken, accessToken))
        .execute()

    if (session.length === 0) {
        console.log("Auth Middleware: No session found for the provided access token")
        return c.json({ error: "Invalid or expired session" }, 401)
    }

    if (!session[0].user) {
        console.log("Auth Middleware: Session found but no associated user")
        return c.json({ error: "User not found" }, 401)
    }

    c.set("session", session[0].sessions)
    c.set("user", {
        id: session[0].user.id,
        userId: session[0].user.id, // For backward compatibility if needed
        username: session[0].user.username,
        email: session[0].user.email,
        role: session[0].user.role
    })

    await next()
}