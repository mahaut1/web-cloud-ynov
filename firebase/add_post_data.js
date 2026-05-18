import app from "../firebaseConfig";

import { addDoc, collection, getFirestore } from "firebase/firestore";

const db = getFirestore(app, "web-cloud");

export const createPost = async (title, text, createdBy) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title,
      text,
      createdBy,
      date: new Date(),
    });

    console.log("Document écrit avec ID :", docRef.id);

    return true;
  } catch (e) {
    console.error("Erreur Firestore :", e);

    return false;
  }
};
