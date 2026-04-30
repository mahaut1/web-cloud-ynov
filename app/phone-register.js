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

  const isValidPhone = (value) => /^\+[1-9]\d{9,14}$/.test(value);

  const sendCode = async () => {
    try {
      if (!isValidPhone(phone)) {
        toast.error("Numéro invalide (ex: +33612345678)");
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-register-container",
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
      console.log(error);
      toast.error("Erreur lors de l'envoi du SMS");
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

      toast.success("Inscription réussie !");
      router.replace("/profile");
    } catch (error) {
      console.log(error);
      toast.error("Code incorrect.");
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Inscription par téléphone</Text>

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
        placeholder="Code reçu par SMS"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={verifyCode}>
        <Text style={styles.buttonText}>Créer le compte</Text>
      </Pressable>

      <div id="recaptcha-register-container"></div>
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
