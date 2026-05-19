import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    getFirestore,
    updateDoc,
} from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app, "web-cloud");

export const toggleLikePost = async (postId, userUid) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return false;
    }

    const post = postSnap.data();
    const likes = post.likes || [];

    if (likes.includes(userUid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(userUid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userUid),
      });
    }

    return true;
  } catch (e) {
    console.error("Erreur like post :", e);
    return false;
  }
};
