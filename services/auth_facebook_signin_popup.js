import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import app from "../firebaseConfig";
import { facebookProvider } from "./auth_facebook_provider_create";

const auth = getAuth(app);

export const signinWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);

    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;

    console.log("Facebook token:", token);
    console.log("User:", user);
    console.log("signin success with facebook");

    return user;
  } catch (error) {
    console.log("Erreur Facebook:", error);

    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = FacebookAuthProvider.credentialFromError(error);

    console.log({ errorCode, errorMessage, email, credential });
  }
};
