import { getAuth, signInWithPopup } from "firebase/auth";
import app from "../firebaseConfig";
import { facebookProvider } from "./auth_facebook_provider_create";

export const signinWithFacebook = async () => {
  const auth = getAuth(app);

  const result = await signInWithPopup(auth, facebookProvider);
  console.log("signin success with facebook", result.user);

  return result.user;
};
