import app from "../firebaseConfig";

import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from "firebase/firestore";

const db = getFirestore(app, "web-cloud");

export const getPostData = async () => {
  try {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Posts récupérés :", posts);

    return posts;
  } catch (e) {
    console.error("Erreur récupération posts :", e);
    return [];
  }
};
