import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(require("../serviceAccountKey.json")),
  // databaseURL: "https://your.firebaseio.com",
});

export const Firestore = admin.firestore();
export const Storage = admin.storage();
export const Auth = admin.auth();
