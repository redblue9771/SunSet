import * as express from "express";
import * as cors from "cors";
import {
  createUser,
  allUser,
  getUser,
  patchUser,
  removeUser,
} from "./users.controller";

export const userService = express();

userService.use(cors());

userService.post(
  "/users",
  // isAuthorized({ hasRole: ["admin", "manager"] }),
  createUser
);
userService.get("/", [
  // isAuthorized({ hasRole: ["admin", "manager"] }),
  allUser,
]);
userService.get("/:id", [
  // isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
  getUser,
]);
userService.patch("/:id", [
  // isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
  patchUser,
]);
userService.delete("/:id", [
  // isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
  removeUser,
]);
