import { Link } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPostData } from "../firebase/get_post_data";
import { toggleLikePost } from "../firebase/like_post";
import app from "../firebaseConfig";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    const data = await getPostData();
    setPosts(data);
  };

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchData();
      } else {
        setPosts([]);
      }
    });

    return unsubscribe;
  }, []);

  const handleLike = async (postId) => {
    if (!user) return;

    const res = await toggleLikePost(postId, user.uid);

    if (res) {
      fetchData();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ynov Connect</Text>

      <Text>Mini réseau social des étudiants Ynov</Text>

      <Link href="/login">Connexion</Link>
      <Link href="/register">Inscription</Link>
      <Link href="/profile">Profil</Link>

      {user ? (
        <>
          <Link href="/newpost" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Créer un post</Text>
            </Pressable>
          </Link>

          <Pressable style={styles.refreshButton} onPress={fetchData}>
            <Text style={styles.buttonText}>Rafraîchir</Text>
          </Pressable>

          {posts.length === 0 ? (
            <Text>Aucun post pour le moment.</Text>
          ) : (
            posts.map((p) => {
              const likes = p.likes || [];
              const liked = likes.includes(user.uid);

              return (
                <View key={p.id} style={styles.post}>
                  <Text style={styles.author}>
                    {p.createdByName || p.createdBy}
                  </Text>

                  <Text>{p.text}</Text>

                  {p.imageURL ? (
                    <Image source={{ uri: p.imageURL }} style={styles.image} />
                  ) : null}

                  <Text>{likes.length} like(s)</Text>

                  <Pressable
                    style={liked ? styles.unlikeButton : styles.likeButton}
                    onPress={() => handleLike(p.id)}
                  >
                    <Text style={styles.buttonText}>
                      {liked ? "Je n'aime plus" : "J'aime"}
                    </Text>
                  </Pressable>

                  <Link href={`/post/${p.id}`} asChild>
                    <Pressable style={styles.detailButton}>
                      <Text style={styles.buttonText}>Voir le post</Text>
                    </Pressable>
                  </Link>
                </View>
              );
            })
          )}
        </>
      ) : (
        <Text style={styles.message}>Connecte-toi pour voir les posts.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  message: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  refreshButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  likeButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
  },
  unlikeButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
  },
  detailButton: {
    backgroundColor: "#7c3aed",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  post: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    gap: 8,
    width: "100%",
  },
  author: {
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
  },
});
