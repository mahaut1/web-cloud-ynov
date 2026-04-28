import { router } from "expo-router";
import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../firebaseConfig";
import { provider } from "./auth_github_provider_create";

export const signinWithGithub = () => {
  const auth = getAuth(app);

  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      console.log("signin success with github");
      console.log(user);
      console.log(token);
      router.replace("/profile");
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
};
