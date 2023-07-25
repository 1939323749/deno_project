import type { MuseumController } from "../museums/index.ts";
import { Application, Router } from "../deps.ts";
import { UserController } from "../user/index.ts";

interface CreateServerDependencies {
  configurations: {
    port: number;
  };
  museum: MuseumController;
  user: UserController;
}

export async function createServer({
  configurations: { port },
  museum,
  user,
}: CreateServerDependencies) {
  const app = new Application();
  app.addEventListener("listen", (e) => {
    console.log(`Listening on: http://${e.hostname}:${port}`);
  });
  app.addEventListener("error", (e) => {
    console.log("Error: ", e.error);
  });
  const appRouter = new Router();
  appRouter.get("/api/museums", async (ctx) => {
    ctx.response.body = { museums: await museum.getAll() };
  });
  appRouter.post("/api/users/register", async (ctx) => {
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
