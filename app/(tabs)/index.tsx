import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Web Cloud Ynov</Text>
      <Text style={styles.subtitle}>Application Expo avec Firebase Auth</Text>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  link: {
    fontSize: 18,
    color: "#007AFF",
  },
});
