import * as functions from "firebase-functions";
import { userService } from "./users/users.service";
import { authService } from "./auth/auth.service";
import { deviceService } from "./devices/devices.service";

export const auth = functions.https.onRequest(authService);
export const users = functions.https.onRequest(userService);
export const devices = functions.https.onRequest(deviceService);
