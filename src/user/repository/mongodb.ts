import { CreateUser, User, UserRepository } from "../types.ts";
import { Database, Collection } from "../../deps.ts";

interface RepositoryDependencies {
  storage: Database;
}

export class Repository implements UserRepository {
  storage: Collection<User>;
  constructor({ storage }: RepositoryDependencies) {
    this.storage = storage.collection<User>("users");
  }
  async create(user: CreateUser) {
    const userWithCreatedAt = { ...user, created_at: new Date() };
    await this.storage.insertOne(userWithCreatedAt);
    return userWithCreatedAt;
  }
  async exists(username: string) {
    return Boolean(await this.storage.findOne({ username }));
  }
  async getByUsername(username: string) {
    const user = await this.storage.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
