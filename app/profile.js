import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { Pressable, StyleSheet, Text, View } from "react-native";
import app from "../firebaseConfig";

export default function Profile() {
  const handleLogout = async () => {
    const auth = getAuth(app);

    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page profil</Text>
      <Text>Bienvenue, votre compte a bien été créé.</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
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
  button: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
