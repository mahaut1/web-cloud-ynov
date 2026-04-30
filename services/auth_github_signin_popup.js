import { getAuth, signInWithPopup } from "firebase/auth";
import app from "../firebaseConfig";
import { githubProvider } from "./auth_github_provider_create";

export const signinWithGithub = async () => {
  const auth = getAuth(app);

  const result = await signInWithPopup(auth, githubProvider);
  console.log("signin success with github", result.user);

  return result.user;
};
