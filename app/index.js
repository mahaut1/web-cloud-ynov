import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Web Cloud Ynov</Text>

      <View style={styles.navbar}>
        <Link href="/" style={styles.link}>
          Accueil
        </Link>
        <Link href="/login" style={styles.link}>
          Connexion
        </Link>
        <Link href="/register" style={styles.link}>
          Inscription
        </Link>
        <Link href="/profile" style={styles.link}>
          Profil
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  navbar: {
    flexDirection: "row",
    gap: 20,
  },
  link: {
    color: "#2563eb",
    fontSize: 16,
  },
});
