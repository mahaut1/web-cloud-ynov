import { addDoc, collection, getFirestore } from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app, "web-cloud");

export const createPost = async (
  text,
  imageURL,
  createdBy,
  createdByName,
  createdByUid,
) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      text,
      imageURL: imageURL || "",
      createdBy,
      createdByName,
      createdByUid,
      date: new Date(),
      likes: [],
    });

    console.log("Post créé avec ID :", docRef.id);
    return true;
  } catch (e) {
    console.error("Erreur création post :", e);
    return false;
  }
};
