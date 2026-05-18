import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { createPost } from "../firebase/add_post_data";
import app from "../firebaseConfig";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
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
      setMessage("Vous devez être connecté pour publier.");
      router.replace("/login");
      return;
    }

    if (!title.trim() || !text.trim()) {
      setMessage("Veuillez remplir le titre et le contenu.");
      return;
    }

    setLoading(true);
    setMessage("Publication en cours...");

    const res = await createPost(title.trim(), text.trim(), user.email);

    setLoading(false);

    if (res) {
      setMessage("Post créé avec succès !");

      setTitle("");
      setText("");

      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } else {
      setMessage("Erreur lors de la création du post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau post</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Contenu"
        value={text}
        onChangeText={setText}
        multiline
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
    fontWeight: "bold",
    color: "#2563eb",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  textarea: {
    height: 120,
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
