import type { User,UserDto } from "./index.ts";

export const UserToUserDto=(user:User):UserDto=>{
    return {
        username:user.username,
        created_at:user.created_at,
    }
}