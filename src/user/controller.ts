import type { UserRepository } from "./types.ts"
import { UserToUserDto } from "./adapter.ts";
type RegisterPayload={username:string,password:string}

interface ControllerDependencies {
    userRepository:UserRepository
}
export class Controller {
    userRepository:UserRepository;
    constructor({userRepository}:ControllerDependencies){
        this.userRepository=userRepository;
    }
    public async register(payload: RegisterPayload) {
        if (await this.userRepository.exists(payload.username)) {
            throw new Error("User already exists");
        }
        const createdUser = await this.userRepository.create({
            username: payload.username,
            hash: "random",
            salt: "random",
        });
        return UserToUserDto(createdUser);
    }
}
