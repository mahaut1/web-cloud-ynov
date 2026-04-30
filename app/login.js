import { router } from "expo-router";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
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

  const handleLogin = async () => {
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
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Connexion réussie.");
      router.replace("/profile");
    } catch (error) {
      Alert.alert("Erreur", error.message);
      console.log(error);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      const user = await signinAnonymously();

      console.log("User anonyme :", user);

      Alert.alert("Succès", "Connexion anonyme réussie.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", error.message);
    }
  };
  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("login success", user);
        router.replace("/profile");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Connexion</Text>

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

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/phone-login")}
      >
        <Text style={styles.buttonText}>Se connecter avec téléphone</Text>
      </Pressable>
      <Pressable onPress={signinWithGithub} style={styles.button}>
        <Text style={styles.buttonText}>Se connecter avec GitHub</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={signinWithFacebook}>
        <Text style={styles.buttonText}>Se connecter avec Facebook</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleAnonymousLogin}>
        <Text style={styles.buttonText}>Continuer anonymement</Text>
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
