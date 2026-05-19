import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { createPost } from "../firebase/add_post_data";
import app from "../firebaseConfig";

export default function NewPost() {
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const handleCreatePost = async () => {
    if (!user) {
      setMessage("Tu dois être connecté pour publier.");
      return;
    }

    if (!text.trim()) {
      setMessage("Écris quelque chose avant de publier.");
      return;
    }

    setLoading(true);
    setMessage("Publication en cours...");

    const authorName = user.displayName || user.email || "Utilisateur inconnu";

    const res = await createPost(
      text.trim(),
      imageURL.trim(),
      user.email,
      authorName,
      user.uid,
    );

    setLoading(false);

    if (res) {
      setMessage("Post publié !");
      setText("");
      setImageURL("");

      setTimeout(() => {
        router.replace("/");
      }, 800);
    } else {
      setMessage("Erreur lors de la publication.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau post</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Quoi de neuf ?"
        value={text}
        onChangeText={setText}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="URL d'image optionnelle"
        value={imageURL}
        onChangeText={setImageURL}
      />

      <Pressable
        style={styles.button}
        onPress={handleCreatePost}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Publication..." : "Publier"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  message: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  textarea: {
    height: 140,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
