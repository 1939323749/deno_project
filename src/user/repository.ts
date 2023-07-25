import type { CreateUser, User, UserRepository } from "./types.ts";

export class Repository implements UserRepository {
    async create(user: CreateUser): Promise<User> {
         const userWithCreatedAt = {
            ...user,created_at:new Date(),
        };
        await this.storage.set(user.username,userWithCreatedAt);
        return userWithCreatedAt;
    }

    async exists(_username: string): Promise<boolean> {
        const user = await this.storage.get(_username);
        return Boolean(user);
    }

    private storage=new Map<User["username"],User>();
}
