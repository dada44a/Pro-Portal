import { Hono, type Context } from "hono";
import { getAllProperties, getPropertyById } from "../controllers/property.controller.js";


const propertyRouter = new Hono();

propertyRouter.get("/", (c: Context) => {
    return getAllProperties(c);
});

propertyRouter.get("/:id", (c: Context) => {
    return getPropertyById(c);

});
export default propertyRouter;
