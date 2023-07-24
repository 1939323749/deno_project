import {
  Controller as MuseumController,
  Repository as MuseumRepository,
} from "./museums/index.ts";
import { createServer } from "./web/index.ts";

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

console.log(await museumController.getAll());

createServer({
  configurations: {
    port: 8000,
  },
	museum: museumController,
});
