import * as cors from "cors";
import * as express from "express";

export const authService = express();

authService.use(cors());

// userService.post(
//   "/users",
//   // isAuthorized({ hasRole: ["admin", "manager"] }),
//   createUser
// );
// authService.get("/", [
//   // isAuthorized({ hasRole: ["admin", "manager"] }),
//   get,
// ]);
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
