import {
  Controller as MuseumController,
  Repository as MuseumRepository,
} from "./museums/index.ts";
import {
  UserController,
  Repository,
  TokenController,
  TokenRepository,
} from "./user/index.ts";
import { createServer } from "./web/index.ts";
import { MongoClient } from "./deps.ts";

const museumRepository = new MuseumRepository();
const museumController = new MuseumController({ museumRepository });

//const userRepository = new UserRepository();
const client = new MongoClient();
await client.connect("mongodb://localhost:27017");
const db = client.database("test");
const userRepository = new Repository({ storage: db });
const userController = new UserController({ userRepository });

const tokenRepository = new TokenRepository();
const tokenController = new TokenController({ tokenRepository });

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

createServer({
  configurations: {
    port: 8000,
  },
  museum: museumController,
  user: userController,
  token: tokenController,
  allowedOrigins: ["http://localhost:3000"],
});
