import { Hono } from "hono";
import { addFavourite, getFavourites, removeFavourite } from "../controllers/favourites.controller.js";

const favouriteRoute = new Hono();

favouriteRoute.get("/", (c) => {
    return getFavourites(c);
});

favouriteRoute.post("/", (c) => {
    return addFavourite(c);
});

favouriteRoute.delete("/:id", (c) => {
    return removeFavourite(c);
});

export default favouriteRoute;