import { getAuth, signInAnonymously } from "firebase/auth";
import app from "../firebaseConfig";

export const signinAnonymously = async () => {
  const auth = getAuth(app);

  try {
    const result = await signInAnonymously(auth);
    console.log("Connexion anonyme réussie :", result.user);
    return result.user;
  } catch (error) {
    console.log("Erreur connexion anonyme :", error);
    throw error;
  }
};
