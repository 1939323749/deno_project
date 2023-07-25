import type { User } from "./index.ts";
import type { UserDto } from "./types.ts";

export const UserToUserDto = (user: User): UserDto => {
  return {
    username: user.username,
    created_at: user.created_at,
  };
};
