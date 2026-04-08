import type { Context } from "hono";
import { getDB } from "../db/index.js";
import { userTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const me = (c: Context) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Not authenticated" }, 401);
    return c.json({
        message: "User info retrieved successfully", user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    });
}

