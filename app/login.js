import { router } from "expo-router";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { toast } from "react-toastify";

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
      toast.error("Email invalide");
      return;
    }

    if (password.length < 6) {
      toast.error("Mot de passe trop court");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Connexion réussie !");
      router.replace("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signinWithGithub();
      toast.success("Connexion GitHub réussie !");
      router.replace("/profile");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Un compte existe déjà avec cet email. Utilisez la bonne méthode de connexion.",
        );
        return;
      }

      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Connexion annulée");
        return;
      }

      toast.error(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signinWithFacebook();
      toast.success("Connexion Facebook réussie !");
      router.replace("/profile");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Un compte existe déjà avec cet email. Utilisez la bonne méthode de connexion.",
        );
        return;
      }

      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Connexion annulée");
        return;
      }

      toast.error(error.message);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await signinAnonymously();
      toast.success("Connexion anonyme réussie !");
      router.replace("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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

      <Pressable style={styles.button} onPress={handleGithubLogin}>
        <Text style={styles.buttonText}>Se connecter avec GitHub</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleFacebookLogin}>
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
