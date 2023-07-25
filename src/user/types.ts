import { User } from "./index.ts";

export type RegisterPayload = {
    username: string;
    password: string;
};

export type CreateUser=Pick<User,"username"|"hash"|"salt">;

export type UserRepository = {
    create: (user: CreateUser) => Promise<User>;
    exists: (username: string) => Promise<boolean>;
};

export type UserDto=Pick<User,"username"|"created_at">;