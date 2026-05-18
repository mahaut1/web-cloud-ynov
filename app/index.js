import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getPostData } from "../firebase/get_post_data";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    const data = await getPostData();
    setPosts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>

      <Link href="/newpost" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Créer un nouveau post</Text>
        </Pressable>
      </Link>

      <Pressable style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.buttonText}>Rafraîchir</Text>
      </Pressable>

      {posts.length === 0 ? (
        <Text>Aucun post pour le moment.</Text>
      ) : (
        posts.map((p) => (
          <View key={p.id} style={styles.item}>
            <Text style={styles.itemTitle}>{p.title}</Text>
            <Text>{p.text}</Text>
            <Text>Auteur : {p.createdBy}</Text>

            <Link href={`/post/${p.id}`} asChild>
              <Pressable style={styles.detailButton}>
                <Text style={styles.buttonText}>Voir le post</Text>
              </Pressable>
            </Link>
          </View>
        ))
      )}
    </ScrollView>
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
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
  },
  refreshButton: {
    backgroundColor: "#16a34a",
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
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
