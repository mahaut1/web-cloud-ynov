import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
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
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleRegister = async () => {
    const auth = getAuth(app);

    if (!prenom || !nom) {
      toast.error("Veuillez renseigner votre prénom et votre nom.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: `${prenom} ${nom}`,
      });

      toast.success("Compte créé avec succès !");
      router.replace("/profile");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Un compte existe déjà avec cette adresse email.");
        return;
      }

      toast.error(error.message);
    }
  };

  const handleGithubRegister = async () => {
    try {
      await signinWithGithub();
      toast.success("Inscription avec GitHub réussie !");
      router.replace("/profile");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Un compte existe déjà avec cet email. Utilisez la bonne méthode de connexion.",
        );
        return;
      }

      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Inscription GitHub annulée.");
        return;
      }

      toast.error(error.message);
    }
  };

  const handleFacebookRegister = async () => {
    try {
      await signinWithFacebook();
      toast.success("Inscription avec Facebook réussie !");
      router.replace("/profile");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Un compte existe déjà avec cet email. Utilisez la bonne méthode de connexion.",
        );
        return;
      }

      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Inscription Facebook annulée.");
        return;
      }

      toast.error(error.message);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await signinAnonymously();
      toast.success("Inscription anonyme réussie !");
      router.replace("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Inscription</Text>

      <TextInput
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        style={styles.input}
      />

      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        style={styles.input}
      />

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
