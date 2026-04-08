import { z } from "zod";

export const favoriteDto = z.object({
    propertyId: z.number().int().positive("Property ID must be a positive integer"),
});