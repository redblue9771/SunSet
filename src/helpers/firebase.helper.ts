import * as admin from "firebase-admin";
import * as fs from "fs";

const serviceAccount = fs.readFileSync("serviceAccountKey.json", "utf8");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  //   databaseURL: "https://fjut-2020.firebaseio.com",
});

export const Firestore = admin.firestore();
export const Storage = admin.storage();
export const Auth = admin.auth();
