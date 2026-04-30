import { router } from "expo-router";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import app from "../firebaseConfig";

export default function Page() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const auth = getAuth(app);

  // ✅ regex international (Firebase compatible)
  const isValidPhone = (value) => /^\+[1-9]\d{9,14}$/.test(value);

  const sendCode = async () => {
    try {
      if (!isValidPhone(phone)) {
        toast.error("Numéro invalide. Format : +33612345678");
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-login-container",
          {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA validé");
            },
          },
        );
      }

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier,
      );

      setConfirmationResult(result);
      toast.success("Code SMS envoyé !");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const verifyCode = async () => {
    try {
      if (!confirmationResult) {
        toast.error("Veuillez d'abord envoyer un code.");
        return;
      }

      if (!code || code.length < 6) {
        toast.error("Code invalide.");
        return;
      }

      await confirmationResult.confirm(code);

      toast.success("Connexion réussie !");
      router.replace("/profile");
    } catch (error) {
      toast.error("Code incorrect.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Connexion par téléphone</Text>

      <TextInput
        placeholder="Numéro ex: +33612345678"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={sendCode}>
        <Text style={styles.buttonText}>Envoyer le code SMS</Text>
      </Pressable>

      <TextInput
        placeholder="Code reçu"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={verifyCode}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>

      <div id="recaptcha-login-container"></div>
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
