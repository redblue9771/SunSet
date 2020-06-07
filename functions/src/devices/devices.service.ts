import * as functions from "firebase-functions";

import {
  handleCreateDevice,
  handleGetDevice,
  handleGetAllDevice,
  handlePatchDevice,
  handleHiddenDevice,
  handleGetDeviceValues,
  handleGetDeviceDataByValue,
  handleAddDeviceData,
} from "./devices.controller";

export const createDevice = functions.https.onCall(handleCreateDevice);
export const getDevice = functions.https.onCall(handleGetDevice);
export const getAllDevice = functions.https.onCall(handleGetAllDevice);
export const updateDevice = functions.https.onCall(handlePatchDevice);
export const deleteDevice = functions.https.onCall(handleHiddenDevice);
export const getDeviceValues = functions.https.onCall(handleGetDeviceValues);
export const getDeviceDataByValue = functions.https.onCall(
  handleGetDeviceDataByValue
);
export const addDeviceData = functions.https.onCall(handleAddDeviceData);
