import { Museum, MuseumRepository } from "./index.ts";

export class Repository implements MuseumRepository {
  storage = new Map<string, Museum>();

  async getAll() {
    return await [...this.storage.values()];
  }
}
