import type { UserRepository,RegisterPayload,UserController } from "./types.ts"
import { UserToUserDto } from "./adapter.ts";
import { generateSalt, hashWithSalt } from "./util.ts";

interface ControllerDependencies {
    userRepository:UserRepository
}
export class Controller implements UserController{
    userRepository:UserRepository;
    constructor({userRepository}:ControllerDependencies){
        this.userRepository=userRepository;
    }
    public async register(payload: RegisterPayload) {
        if (await this.userRepository.exists(payload.username)) {
            throw new Error("User already exists");
        }
        const createdUser = await this.userRepository.create(
            await this.getHashedUser(payload.username,payload.password)
        );
        return UserToUserDto(createdUser);
    }
    public async getHashedUser(username: string,password:string) {
        const salt=generateSalt();
        const user= {
            username,
            hash:await hashWithSalt(password,salt),
            salt,
            created_at:new Date()
        };
        return user;
    }

}
