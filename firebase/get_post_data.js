import app from "../firebaseConfig";

import { collection, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore(app, "web-cloud");

export const getPostData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Posts récupérés :", posts);

    return posts;
  } catch (e) {
    console.error("Erreur récupération :", e);

    return [];
  }
};
