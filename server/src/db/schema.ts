import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { access } from "fs";

export const userTable = sqliteTable("user", {
    id: integer().primaryKey({ autoIncrement: true }),
    firstName: text().notNull(),
    lastName: text().notNull(),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    role: text({ enum: ["USER", "ADMIN"] }).notNull().default("USER"),
    createdAt: text("timestamp").notNull().default(sql`(current_timestamp)`),
    updatedAt: text("timestamp").notNull().default(sql`(current_timestamp)`)
})

export const logTable = sqliteTable("logs", {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer().notNull(),
    action: text().notNull(),
    timestamp: text("timestamp").notNull().default(sql`(current_timestamp)`),
})

export const sessionsTable = sqliteTable("sessions", {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer().notNull().references(() => userTable.id),
    refreshToken: text("refresh_token").notNull(),
    accessToken: text("access_token").notNull(),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
    expiresAt: text("expires_at"),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
});

export const favoriteTable = sqliteTable("favorites", {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer().notNull().references(() => userTable.id),
    propertyId: integer().notNull(),
    createdAt: text("timestamp").notNull().default(sql`(current_timestamp)`)
})