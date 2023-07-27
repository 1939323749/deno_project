import { UserController, TokenController, TokenRepository } from "./index.ts";
import { UserRepository } from "./repository/inmemory.ts";
import { hashWithSalt } from "./util.ts";
import { t } from "../deps.ts";

Deno.test("it is able to get HashedUser", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";
  const password = "password 1";

  const allUsers = await user.getHashedUser(username, password);

  t.assertEquals(allUsers.username, username, "has the correct username");
  t.assertEquals(
    allUsers.hash,
    await hashWithSalt(password, allUsers.salt),
    "has the correct hash"
  );
  t.assertEquals(allUsers.salt, allUsers.salt, "has the correct salt");
  t.assertEquals(
    allUsers.created_at,
    allUsers.created_at,
    "has the correct created_at"
  );
});

Deno.test("it is able to create user", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";
  const password = "password 1";

  const allUsers = await user.getHashedUser(username, password);

  const createdUser = await user.userRepository.create(allUsers);

  t.assertEquals(createdUser.username, username, "has the correct username");
  t.assertEquals(
    createdUser.hash,
    await hashWithSalt(password, createdUser.salt),
    "has the correct hash"
  );
  t.assertEquals(createdUser.salt, createdUser.salt, "has the correct salt");
  t.assertEquals(
    createdUser.created_at,
    createdUser.created_at,
    "has the correct created_at"
  );
});

Deno.test("it is able to get user by username", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";
  const password = "password 1";

  repository.create(await user.getHashedUser(username, password));

  const getUser = await user.userRepository.getByUsername(username);

  t.assertEquals(getUser.username, username, "has the correct username");
  t.assertEquals(
    getUser.hash,
    await hashWithSalt(password, getUser.salt),
    "has the correct hash"
  );
  t.assertEquals(getUser.salt, getUser.salt, "has the correct salt");
  t.assertEquals(
    getUser.created_at,
    getUser.created_at,
    "has the correct created_at"
  );
});

Deno.test("it is able to check if user exists", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";

  const exists = await user.userRepository.exists(username);

  t.assertEquals(exists, false, "has the correct username");

  const password = "password 1";

  user.userRepository.create(await user.getHashedUser(username, password));

  const exists2 = await user.userRepository.exists(username);

  t.assertEquals(exists2, true, "has the correct username");
});

Deno.test("it is able to compare password", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";
  const password = "password 1";

  await user.register({ username, password });

  const getUser = await user.userRepository.getByUsername(username);

  const compare = await user.comparePassword(password, getUser);

  t.assertEquals(compare, true, "has the correct username");
});

Deno.test("it is able to register", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";
  const password = "password 1";

  const register = await user.register({ username, password });

  t.assertEquals(register.username, username, "has the correct username");
  t.assertEquals(
    register.created_at,
    register.created_at,
    "has the correct created_at"
  );
});

Deno.test("it is able to login", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });

  const username = "user 1";
  const password = "password 1";

  await user.register({ username, password });

  const login = await user.login({ username, password });

  t.assertEquals(login.username, username, "has the correct username");
  t.assertEquals(
    login.created_at,
    login.created_at,
    "has the correct created_at"
  );
  try {
    await user.login({ username, password: "password 2" });
  } catch (e) {
    t.assertEquals(
      e.message,
      "Username and password combination is not correct"
    );
  }
});

Deno.test("it is able to create token", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });
  const tokenRepository = new TokenRepository();
  const token = new TokenController({ tokenRepository });

  const username = "user 1";
  const password = "password 1";

  const createdUser = await user.register({ username, password });

  const createdToken = await token.create(createdUser.username);

  t.assertEquals(createdToken.length, 36, "has the correct token");
});

Deno.test("it is able to verify token", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });
  const tokenRepository = new TokenRepository();
  const token = new TokenController({ tokenRepository });

  const username = "user 1";
  const password = "password 1";

  const createdUser = await user.register({ username, password });

  const createdToken = await token.create(createdUser.username);

  const verifyToken = await token.verify(createdToken);

  t.assertEquals(verifyToken, createdUser.username, "has the correct token");
});

Deno.test("it is able to delete token", async () => {
  const repository = new UserRepository();
  const user = new UserController({ userRepository: repository });
  const tokenRepository = new TokenRepository();
  const token = new TokenController({ tokenRepository });

  const username = "user 1";
  const password = "password 1";

  const createdUser = await user.register({ username, password });

  const createdToken = await token.create(createdUser.username);

  const verifyToken = await token.verify(createdToken);

  t.assertEquals(verifyToken, createdUser.username, "has the correct token");

  await token.delete(createdToken);

  try {
    await token.verify(createdToken);
  } catch (e) {
    t.assertEquals(e.message, "Error: Token not found");
  }
});
