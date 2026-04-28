import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { provider } from "./auth_github_provider_create";

const auth = getAuth();

export const signinWithGithub = () => {
  console.log("signinWithGithub");

  signInWithPopup(auth, provider)
    .then((result) => {
      // Token GitHub
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Utilisateur connecté
      const user = result.user;

      console.log("signin success with github");
      console.log("User:", user);
      console.log("Token:", token);
    })
    .catch((error) => {
      console.log("Erreur GitHub:", error);

      const errorCode = error.code;
      const errorMessage = error.message;

      const credential = GithubAuthProvider.credentialFromError(error);

      console.log("Code:", errorCode);
      console.log("Message:", errorMessage);
    });
};
