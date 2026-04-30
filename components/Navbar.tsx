import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Navbar() {
  return (
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
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
