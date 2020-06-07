import * as functions from "firebase-functions";
import { handleInitialUser } from "./users.controller";

export const initialUser = functions.auth.user().onCreate(handleInitialUser);
