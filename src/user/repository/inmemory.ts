import type { CreateUser, User, UserRepository as userRepository, TokenRepository as tokenRepository} from "../types.ts";

export class UserRepository implements userRepository {
  async create(user: CreateUser): Promise<User> {
    const userWithCreatedAt = {
      ...user,
      created_at: new Date(),
    };
    await this.storage.set(user.username, userWithCreatedAt);
    return userWithCreatedAt;
  }

  async exists(_username: string): Promise<boolean> {
    const user = await this.storage.get(_username);
    return Boolean(user);
  }

  async getByUsername(_username: string): Promise<User> {
    const user = await this.storage.get(_username);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  private storage = new Map<User["username"], User>();
}

export class TokenRepository implements tokenRepository {
  async create(token: string, username: string): Promise<void> {
    await this.storage.set(token, username);
  }

  async exists(token: string): Promise<boolean> {
    const user = await this.storage.get(token);
    return Boolean(user);
  }

  async getByToken(token: string): Promise<string> {
    const user = await this.storage.get(token);
    if (!user) {
      throw new Error("Token not found");
    }
    return user;
  }

  async delete(token: string): Promise<void> {
    await this.storage.delete(token);
  }

  private storage = new Map<string, string>();
}