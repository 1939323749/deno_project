import type { MuseumController } from "../museums/index.ts";
import { Application, Router, RouterMiddleware, oakCors } from "../deps.ts";
import { UserController, TokenController } from "../user/index.ts";

interface CreateServerDependencies {
  configurations: {
    port: number;
  };
  museum: MuseumController;
  user: UserController;
  token: TokenController;
  allowedOrigins: string[];
}

export async function createServer({
  configurations: { port },
  museum,
  user,
  token,
  allowedOrigins,
}: CreateServerDependencies) {
  const app = new Application();
  app.use(oakCors({ origin: allowedOrigins }));
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
    console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
  });
  app.addEventListener("listen", (e) => {
    console.log(`Listening on: http://${e.hostname}:${port}`);
  });
  app.addEventListener("error", (e) => {
    console.log("Error: ", e.error);
  });
  const appRouter = new Router({ prefix: "/api" });
  appRouter.use(async (_, next) => {
    console.log("Request was made to /api");
    await next();
  });
  const authMiddleware: RouterMiddleware<"/"> = async (ctx, next) => {
    const authHeader = ctx.request.headers.get("token");
    if (!authHeader) {
      ctx.response.status = 401;
      ctx.response.body = "Authorization header required";
      return;
    }
    const user_token = authHeader;
    if (!token) {
      ctx.response.status = 401;
      ctx.response.body = "Token required";
      return;
    }
    try {
      const username = await token.verify(user_token);
      if (!username) {
        ctx.response.status = 401;
        ctx.response.body = "Invalid token";
        return;
      }
    } catch (e) {
      ctx.response.status = 401;
      ctx.response.body = e.message;
      return;
    }
    await next();
  };
  appRouter.get("/museums", authMiddleware, async (ctx) => {
    ctx.response.body = { museums: await museum.getAll() };
  });
  appRouter.post("/users/register", async (ctx) => {
    const { username, password } = await ctx.request.body().value;
    if (!username || !password) {
      ctx.response.status = 400;
      ctx.response.body = "Username and password are required";
      return;
    }
    try {
      const createdUser = await user.register({ username, password });
      ctx.response.status = 201;
      ctx.response.body = { user: createdUser };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: e.message };
    }
  });
  appRouter.post("/users/login", async (ctx) => {
    const { username, password } = await ctx.request.body().value;
    if (!username || !password) {
      ctx.response.status = 400;
      ctx.response.body = "Username and password are required";
      return;
    }
    try {
      const userDto = await user.login({ username, password });
      ctx.response.headers.set("token", await token.create(username));
      ctx.response.status = 201;
      ctx.response.body = { user: userDto };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: e.message };
    }
  });
  app.use(appRouter.routes());
  app.use(appRouter.allowedMethods());
  app.use(async (ctx, next) => {
    ctx.response.body = "Hello World!";
    await next();
  });
  await app.listen({ port });
}

interface CreateServerDependencies {
  configurations: {
    port: number;
  };
  museum: MuseumController;
}
