export type User = {
  username: string;
  hash: string;
  salt: string;
  created_at: Date;
};

export type RegisterPayload = {
  username: string;
  password: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type CreateUser = Pick<User, "username" | "hash" | "salt">;

export type UserRepository = {
  create: (user: CreateUser) => Promise<User>;
  exists: (username: string) => Promise<boolean>;
  getByUsername: (username: string) => Promise<User>;
};

export type TokenRepository = {
  create: (token: string, username: string) => Promise<void>;
  exists: (token: string) => Promise<boolean>;
  getByToken: (token: string) => Promise<string>;
  delete: (token: string) => Promise<void>;
};

export interface UserController {
  register: (payload: RegisterPayload) => Promise<UserDto>;
  login: (payload: LoginPayload) => Promise<UserDto>;
  getHashedUser: (username: string, password: string) => Promise<User>;
  comparePassword: (password: string, user: User) => Promise<boolean>;
}

export interface TokenController {
  create: (username: string) => Promise<string>;
  verify: (token: string) => Promise<string>;
  delete: (token: string) => Promise<void>;
}

export type UserDto = Pick<User, "username" | "created_at">;
