import { generateSalt, hashWithSalt } from "./util.ts";

Deno.bench("run generateSalt 1000 times", () => {
  for (let i = 0; i < 1000; i++) {
    generateSalt();
  }
});

Deno.bench("run hashWithSalt 1000 times", async () => {
  for (let i = 0; i < 1000; i++) {
    await hashWithSalt("password", generateSalt());
  }
});
