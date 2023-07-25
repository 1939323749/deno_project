import type {
  UserRepository,
  RegisterPayload,
  UserController,
  User,
} from "./types.ts";
import { UserToUserDto } from "./adapter.ts";
import { generateSalt, hashWithSalt } from "./util.ts";

interface ControllerDependencies {
  userRepository: UserRepository;
}
export class Controller implements UserController {
  userRepository: UserRepository;
  constructor({ userRepository }: ControllerDependencies) {
    this.userRepository = userRepository;
  }
  public async register(payload: RegisterPayload) {
    if (await this.userRepository.exists(payload.username)) {
      throw new Error("User already exists");
    }
    const createdUser = await this.userRepository.create(
      await this.getHashedUser(payload.username, payload.password)
    );
    return UserToUserDto(createdUser);
  }
  public async getHashedUser(username: string, password: string) {
    const salt = generateSalt();
    const user = {
      username,
      hash: await hashWithSalt(password, salt),
      salt,
      created_at: new Date(),
    };
    return user;
  }
  public async login(payload: RegisterPayload) {
    try {
      const user = await this.userRepository.getByUsername(payload.username);

      await this.comparePassword(payload.password, user);

      return UserToUserDto(user);
    } catch (e) {
      console.log(e);
      throw new Error("Username and password combination is not correct");
    }
  }
  public async comparePassword(password: string, user: User) {
    const hashedPassword = await hashWithSalt(password, user.salt);
    if (hashedPassword === user.hash) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  }
}
