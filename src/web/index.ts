import type { MuseumController } from "../museums/index.ts";
import { Application,Router } from "../deps.ts";

interface CreateServerDependencies {
  configurations: {
    port: number;
  },
  museum: MuseumController;
}

export async function createServer({ configurations: { port }, museum }: CreateServerDependencies) {
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
  },
  museum: MuseumController;
}
