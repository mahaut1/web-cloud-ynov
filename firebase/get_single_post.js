import { doc, getDoc, getFirestore } from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app, "web-cloud");

export const getSinglePost = async (id) => {
  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }

    return null;
  } catch (e) {
    console.error("Erreur récupération post :", e);
    return null;
  }
};
