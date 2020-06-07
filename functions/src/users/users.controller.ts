import { UserRecord } from "firebase-functions/lib/providers/auth";
import { Firestore } from "../helpers/firebase.helper";
import { EventContext } from "firebase-functions";

export const handleInitialUser: (
  user: UserRecord,
  context: EventContext
) => any = async ({ uid, displayName }) => {
  try {
    const docRef = Firestore.collection(`users`).doc(`${uid}`);
    await docRef.set({
      uid,
    });
    console.log(`${uid} is added to firestore!`);
  } catch (err) {
    console.error(err);
  }
};
