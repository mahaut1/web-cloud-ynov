import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Navbar from "../components/Navbar";
import app from "../firebaseConfig";
import { signinAnonymously } from "../services/auth_anonymous_signin";
import { signinWithFacebook } from "../services/auth_facebook_signin_popup";
import { signinWithGithub } from "../services/auth_github_signin_popup";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleRegister = async () => {
    const auth = getAuth(app);

    if (!isValidEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères.",
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Compte créé avec succès.");
      router.replace("/profile");
    } catch (error) {
      Alert.alert("Erreur", error.message);
      console.log(error);
    }
  };

  const handleFacebookRegister = async () => {
    try {
      await signinWithFacebook();
      Alert.alert("Succès", "Inscription avec Facebook réussie.");
      router.replace("/profile");
    } catch (error) {
      Alert.alert("Erreur Facebook", error.message);
      console.log(error);
    }
  };

  const handleGithubRegister = async () => {
    try {
      await signinWithGithub();
      Alert.alert("Succès", "Inscription avec GitHub réussie.");
      router.replace("/profile");
    } catch (error) {
      Alert.alert("Erreur GitHub", error.message);
      console.log(error);
    }
  };
  const handleAnonymousLogin = async () => {
    try {
      await signinAnonymously();
      Alert.alert("Succès", "Inscription anonyme réussie.");
      router.replace("/profile");
    } catch (error) {
      Alert.alert("Erreur", error.message);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleGithubRegister}>
        <Text style={styles.buttonText}>S'inscrire avec GitHub</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleFacebookRegister}>
        <Text style={styles.buttonText}>S'inscrire avec Facebook</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/phone-register")}
      >
        <Text style={styles.buttonText}>S'inscrire avec téléphone</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleAnonymousLogin}>
        <Text style={styles.buttonText}>S'inscrire anonymement</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
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
