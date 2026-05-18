import { addDoc, collection, getFirestore } from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app, "web-cloud");

export const createComment = async (postId, text, createdBy) => {
  try {
    const docRef = await addDoc(collection(db, "comments"), {
      postId,
      text,
      createdBy,
      date: new Date(),
    });

    console.log("Commentaire créé :", docRef.id);
    return true;
  } catch (e) {
    console.error("Erreur création commentaire :", e);
    return false;
  }
};
