import { router, useLocalSearchParams } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { createComment } from "../../firebase/add_comment_data";
import app from "../../firebaseConfig";

export default function NewComment() {
  const { id } = useLocalSearchParams();

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

  const handleCreateComment = async () => {
    if (!user) {
      setMessage("Vous devez être connecté pour commenter.");
      return;
    }

    if (!text.trim()) {
      setMessage("Veuillez écrire un commentaire.");
      return;
    }

    setLoading(true);
    setMessage("Publication du commentaire...");

    const author = user.displayName || user.email || "Utilisateur inconnu";

    const res = await createComment(id, text.trim(), author);

    setLoading(false);

    if (res) {
      setMessage("Commentaire ajouté !");

      setText("");

      setTimeout(() => {
        router.replace(`/post/${id}`);
      }, 800);
    } else {
      setMessage("Erreur lors de l'ajout du commentaire.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau commentaire</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Votre commentaire"
        value={text}
        onChangeText={setText}
        multiline
      />

      <Pressable
        style={styles.button}
        onPress={handleCreateComment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Publication..." : "Publier le commentaire"}
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
