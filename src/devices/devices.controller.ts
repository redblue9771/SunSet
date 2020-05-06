import { Request, Response } from "express";
import { handleError } from "../helpers/err.helper";
import { Auth, Firestore } from "../helpers/firebase.helper";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import { firestore } from "firebase-admin";

export async function creatDevice(req: Request, res: Response) {
  try {
    const { user_id, values, ...props } = req.body;
    const batch = Firestore.batch();
    // firestore.FieldValue;
    const ref = Firestore.collection("devices");
    const docRef = await ref.add({
      ...props,
      userRef: `/users/${user_id}`,
    });

    const subDoc = await docRef.collection("values").add({ ...(values || {}) });

    const snapshot = await docRef.get();

    return res.status(200).send({
      message: "ok",
      data: {
        id: snapshot.id,
        ...(snapshot.data() || {}),
      },
    });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function getDevice(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const doc = await Firestore.collection("devices").doc(id).get();
    return res.status(200).send({
      message: "ok",
      data: doc,
    });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function allUser(req: Request, res: Response) {
  try {
    const listUsers = await Auth.listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).send({ users });
  } catch (err) {
    return handleError(res, err);
  }
}

function mapUser(user: UserRecord) {
  const customClaims = (user.customClaims || { role: "" }) as { role?: string };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await Auth.getUser(id);
    console.info("user", JSON.stringify(user));
    return res.status(200).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patchUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: "Missing fields" });
    }

    await Auth.updateUser(id, { displayName, password, email });
    await Auth.setCustomUserClaims(id, { role });
    const user = await Auth.getUser(id);

    return res.status(204).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function removeUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await Auth.deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}
