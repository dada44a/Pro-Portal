import { Hono, type Context } from 'hono';
import { login, logout, refreshToken, register } from '../controllers/auth.controller.js';


const authRouter = new Hono();

authRouter.get('/home', (c: Context) => c.json({ message: 'Auth route' }));

authRouter.post('/register', async (c: Context) => {
    return register(c);
});

authRouter.post('/login', async (c: Context) => {
    return login(c);
});

authRouter.get('/refresh', async (c: Context) => {
    return await refreshToken(c);
});

authRouter.delete('/logout', async (c: Context ) => {
    return logout(c);
});




export default authRouter;
