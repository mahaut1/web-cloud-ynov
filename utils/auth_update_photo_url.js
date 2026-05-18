import app from "../firebaseConfig";

import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(app);

export const updateUserPhotoUrl = async (downloadURL) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL: downloadURL,
    });

    return true;
  } catch (e) {
    return false;
  }
};
