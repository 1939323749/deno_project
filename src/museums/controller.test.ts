import { t } from "../deps.ts";
import { Controller } from "./controller.ts";

Deno.test("it lists all museums", async () => {
  const controller = new Controller({
    museumRepository: {
      getAll: async () =>
        await [
          {
            description:
              "The world's largest art museum and a historic monument in Paris, France.",
            id: "1fbdd2a9-1b97-46e0-b450-62819e5772ff",
            location: {
              lat: "48.860294",
              lng: "2.33862",
            },
            name: "The Louvre",
          },
        ],
    },
  });

  const [museum] = await controller.getAll();

  t.assertEquals(museum.name, "The Louvre");
  t.assertEquals(
    museum.description,
    "The world's largest art museum and a historic monument in Paris, France."
  );
  t.assertEquals(museum.location.lat, "48.860294");
  t.assertEquals(museum.location.lng, "2.33862");
});
