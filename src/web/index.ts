import type { MuseumController } from "./index.ts";

async function serveHttp(conn: Deno.Conn, museum: any) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      if (
        requestEvent.request.url.endsWith("/api/museums") &&
        requestEvent.request.method === "GET"
      ) {
        requestEvent.respondWith(
          new Response(JSON.stringify({museums:await museum.getAll()}), {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          }),
        );
      } else {
        requestEvent.respondWith(
          new Response("Not Found", {
            status: 404,
            headers: {
              "content-type": "text/plain",
            },
          }),
        );
      }
    }
  }

export async function createServer({ configurations: { port }, museum }: CreateServerDependencies) {
  const server = Deno.listen({ port });
  console.log(`Server running on port ${port}`);

  for await (const conn of server) {
    serveHttp(conn,museum);
  }
}

interface CreateServerDependencies {
  configurations: {
    port: number;
  },
  museum: MuseumController;
}
