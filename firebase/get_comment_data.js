import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app, "web-cloud");

export const getCommentData = async (postId) => {
  try {
    const q = query(collection(db, "comments"), where("postId", "==", postId));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Erreur récupération commentaires :", e);
    return [];
  }
};
