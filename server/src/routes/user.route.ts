import { Hono } from "hono";
import { me } from "../controllers/user.controller.js";

const userRouter = new Hono();


userRouter.get("/me", (c) => {
    return me(c);
});


export default userRouter;