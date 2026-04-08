import type { Context } from "hono";
import { getDB } from "../db/index.js";
import { favoriteTable, logTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { boolean, z } from "zod";
import { favoriteDto } from "../Dtos/favourite.js";

export const getFavourites = async (c: Context) => {
    try {

        const user = c.get("user");
        if (!user) return c.json({ error: "Not authenticated" }, 401);

        const db = getDB();
        const favourites = await db.select().from(favoriteTable).where(eq(favoriteTable.userId, Number(user.userId))).execute();
        const favouriteProperties = favourites.map(fav => fav.propertyId).filter(Boolean);

        return c.json({ favouriteProperties: favouriteProperties }, 200);
    } catch (error) {
        console.error("Error fetching favourites:", error);
        return c.json({ error: "An error occurred while fetching favourites" }, 500);
    }

}

export const addFavourite = async (c: Context) => {
    try {
        const parsed = favoriteDto.parse(await c.req.json());
        const { propertyId } = parsed;
        const user = c.get("user");
        if (!user) return c.json({ error: "Not authenticated" }, 401);
        const db = getDB();
        const existingFavourite = await db.select().from(favoriteTable)
            .where(and(eq(favoriteTable.userId, Number(user.userId)), eq(favoriteTable.propertyId, propertyId)))
            .limit(1)
            .execute();

        if (existingFavourite.length > 0) {
            return c.json({ error: "Property already in favourites" }, 400);
        }

        await db.insert(favoriteTable).values({
            userId: Number(user.userId),
            propertyId: propertyId,
        }).execute();

        await db.insert(logTable).values({
            userId: Number(user.userId),
            action: `Added property ${propertyId} to favourites`,
        }).execute();

        return c.json({ message: "Property added to favourites" }, 201);
    } catch (error) {
        console.error("Error adding favourite:", error);
        return c.json({ error: "An error occurred while adding to favourites" }, 500);
    }
}

export const removeFavourite = async (c: Context) => {
    try {
        const propertyId = Number(c.req.param("id"));
        const user = c.get("user");
        if (!user) return c.json({ error: "Not authenticated" }, 401);

        const db = getDB();
        const existingFavourite = await db.select().from(favoriteTable)
            .where(and(eq(favoriteTable.userId, Number(user.userId)), eq(favoriteTable.propertyId, propertyId)))
            .execute();

        if (existingFavourite.length === 0) {
            return c.json({ error: "Favourite not found" }, 404);
        }

        await db.delete(favoriteTable)
            .where(and(eq(favoriteTable.userId, Number(user.userId)), eq(favoriteTable.propertyId, propertyId)))
            .execute();

        await db.insert(logTable).values({
            userId: Number(user.userId),
            action: `Removed property ${propertyId} from favourites`,
        }).execute();

        return c.json({ message: "Property removed from favourites" }, 200);
    } catch (error) {
        console.error("Error removing favourite:", error);
        return c.json({ error: "An error occurred while removing from favourites" }, 500);
    }
}