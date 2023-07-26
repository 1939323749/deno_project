import { createServer } from "./web/index.ts";
import {Controller as MuseumController,Repository as MuseumRepository } from "./museums/index.ts";
import { UserController, UserRepository, TokenController, TokenRepository } from "./user/index.ts";
import { t } from "./deps.ts";

Deno.test("it should let users with a valid token access the museums list", async () => {
    const userRepository = new UserRepository();
    const userController = new UserController({ userRepository });
    const tokenRepository = new TokenRepository();
    const tokenController = new TokenController({ tokenRepository });
    const museumRepository = new MuseumRepository();
    const museumController = new MuseumController({ museumRepository });
    museumRepository.storage.set("1fbdd2a9-1b97-46e0-b450-62819e5772ff", {
      id: "1fbdd2a9-1b97-46e0-b450-62819e5772ff",
      name: "The Louvre",
      description:
        "The world's largest art museum and a historic monument in Paris, France.",
      location: {
        lat: "48.860294",
        lng: "2.33862",
      },
    });
    const server = await createServer({
      configurations: {
        port: 8001,
      },
      museum: museumController,
      user: userController,
      token: tokenController,
      allowedOrigins: ["http://localhost:3000"],
    });
  
    const register = await fetch("http://localhost:8001/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    });
    const body = await register.text();
    t.assertStringIncludes(body, "created_at");

    const login = await fetch("http://localhost:8001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    });
    const token = await login.headers.get("token");
    t.assertStringIncludes(await login.text(), "created_at", "login success");

    const get_all_museums = await fetch("http://localhost:8001/api/museums", {
      headers: {
        "Content-Type": "application/json",
        "token": token??"",
      },
    });
    const all_museums = await get_all_museums.text();
    t.assertStringIncludes(all_museums, "The Louvre", "get all museums success");
    
    server.controller.abort();
  });