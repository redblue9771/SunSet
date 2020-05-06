import * as cors from "cors";
import * as express from "express";
import { getDevice } from "./devices.controller";

export const deviceService = express();

deviceService.use(cors());

// deviceService.post(
//   "/users",
//   // isAuthorized({ hasRole: ["admin", "manager"] }),
//   createUser
// );
deviceService.get("/", [
  // isAuthorized({ hasRole: ["admin", "manager"] }),
  getDevice,
]);
// userService.get("/:id", [
//   // isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
//   getUser,
// ]);
// userService.patch("/:id", [
//   // isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
//   patchUser,
// ]);
// userService.delete("/:id", [
//   // isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
//   removeUser,
// ]);
