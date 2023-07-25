export type User={
    username:string,
    hash:string,
    salt:string,
    created_at:Date,
}

export type RegisterPayload = {
    username: string;
    password: string;
};

export type CreateUser=Pick<User,"username"|"hash"|"salt">;

export type UserRepository = {
    create: (user: CreateUser) => Promise<User>;
    exists: (username: string) => Promise<boolean>;
};

export interface UserController {
    register: (payload: RegisterPayload) => Promise<UserDto>;
    getHashedUser: (username: string,password:string) => Promise<User>;
}

export type UserDto=Pick<User,"username"|"created_at">;