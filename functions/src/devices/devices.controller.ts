import { firestore } from "firebase-admin";
import {
  CallableContext,
  HttpsError,
} from "firebase-functions/lib/providers/https";
import { Firestore } from "../helpers/firebase.helper";

export const handleCreateDevice: (
  data: any,
  context: CallableContext
) => any = async ({ values, ...props }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  try {
    const ref = Firestore.collection("devices");
    const docRef = await ref.add({
      ...(props || {}),
      isDeleted: false,
      create_at: firestore.FieldValue.serverTimestamp(),
      update_at: firestore.FieldValue.serverTimestamp(),
      userRef: `/users/${context.auth.uid}`,
    });

    if (Array.isArray(values)) {
      const batch = Firestore.batch();
      values.forEach((item) =>
        batch.create(docRef.collection("values").doc(), item)
      );
      await batch.commit();
    }

    const snapshot = await docRef.get();

    return {
      _id: snapshot.id,
      ...(snapshot.data() || {}),
    };
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handleGetDevice: (
  data: any,
  context: CallableContext
) => any = async ({ _id }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  if (!_id) {
    throw new HttpsError("invalid-argument", "_id is null!");
  }
  try {
    const snapshot = await Firestore.doc(`devices/${_id}`).get();
    return {
      _id: snapshot.id,
      ...(snapshot.data() || {}),
    };
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handleGetAllDevice: (
  data: any,
  context: CallableContext
) => any = async (_, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  try {
    const snapshot = await Firestore.collection("devices")
      .where("userRef", "==", `/users/${context.auth.uid}`)
      .where("isDeleted", "==", false)
      .get();

    return snapshot.docs.map((item) => ({
      _id: item.id,
      ...(item.data() || {}),
    }));
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handlePatchDevice: (
  data: any,
  context: CallableContext
) => any = async ({ _id, values, ...baseInfo }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  if (!_id) {
    throw new HttpsError("invalid-argument", "_id is null!");
  }
  try {
    const docRef = Firestore.doc(`devices/${_id}`);

    await docRef.update({
      ...baseInfo,
    });

    if (Array.isArray(values)) {
      const batch = Firestore.batch();
      values.forEach((item) =>
        batch.create(docRef.collection("values").doc(), item)
      );
      await batch.commit();
    }

    const snapshot = await docRef.get();

    return {
      _id: snapshot.id,
      ...(snapshot.data() || {}),
    };
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handleHiddenDevice: (
  data: any,
  context: CallableContext
) => any = async ({ _id }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  if (!_id) {
    throw new HttpsError("invalid-argument", "_id is null!");
  }
  try {
    const docRef = Firestore.collection("devices").doc(_id);
    await docRef.update({
      isDeleted: true,
    });

    return "ok";
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handleGetDeviceValues: (
  data: any,
  context: CallableContext
) => any = async ({ _id }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  if (!_id) {
    throw new HttpsError("invalid-argument", "_id is null!");
  }
  try {
    const docRef = Firestore.collection(`devices/${_id}/values`);

    const res = await docRef.get();

    return res.docs.map((item) => ({
      _id: item.id,
      ...(item.data() || {}),
    }));
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handleGetDeviceDataByValue: (
  data: any,
  context: CallableContext
) => any = async ({ device_id, value_id }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }

  if (!device_id || !value_id) {
    throw new HttpsError("invalid-argument", "device_id or value_id is null!");
  }
  try {
    const docRef = Firestore.collection(
      `devices/${device_id}/values/${value_id}/data`
    ).orderBy("timestamp", "desc");

    const res = await docRef.get();

    return res.docs.map((item) => ({
      _id: item.id,
      ...(item.data() || {}),
    }));
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};

export const handleAddDeviceData: (
  data: any,
  context: CallableContext
) => any = async ({ device_id, value_id, payload, ...props }, context) => {
  if (!context.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  if (
    !device_id ||
    !value_id ||
    Object.prototype.toString.call(payload) !== "[object Number]"
  ) {
    throw new HttpsError("invalid-argument", "id or payload is null!");
  }
  try {
    const doc = Firestore.doc(`devices/${device_id}`);

    const time = firestore.FieldValue.serverTimestamp();
    const ref = Firestore.collection(
      `devices/${device_id}/values/${value_id}/data`
    );
    await ref.add({
      payload,
      timestamp: time,
      ...(props || {}),
    });

    await doc.update({
      update_at: time,
    });

    return "ok";
  } catch (err) {
    throw new HttpsError("not-found", "query is undefined.", err);
  }
};
