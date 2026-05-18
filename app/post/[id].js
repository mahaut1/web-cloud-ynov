import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getCommentData } from "../../firebase/get_comment_data";
import { getSinglePost } from "../../firebase/get_single_post";

export default function PostDetail() {
  const { id } = useLocalSearchParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const postData = await getSinglePost(id);
    const commentsData = await getCommentData(id);

    setPost(postData);
    setComments(commentsData);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Chargement du post...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>

      <Text>{post.text}</Text>

      <Text style={styles.author}>Auteur : {post.createdBy}</Text>

      <Link href={`/newcomment/${id}`} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Ajouter un commentaire</Text>
        </Pressable>
      </Link>

      <Pressable style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.buttonText}>Rafraîchir les commentaires</Text>
      </Pressable>

      <Text style={styles.subtitle}>Commentaires</Text>

      {comments.length === 0 ? (
        <Text>Aucun commentaire pour le moment.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Text>{comment.text}</Text>
            <Text style={styles.author}>Par : {comment.createdBy}</Text>
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  author: {
    fontStyle: "italic",
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
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  comment: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
});
