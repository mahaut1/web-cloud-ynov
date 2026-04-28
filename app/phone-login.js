import { router } from "expo-router";
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import app from "../firebaseConfig";

export default function Page() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const auth = getAuth(app);

  const sendCode = async () => {
    try {
      if (!phone.startsWith("+")) {
        Alert.alert(
          "Erreur",
          "Le numéro doit commencer par l’indicatif, ex: +33612345678",
        );
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
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
      Alert.alert("Succès", "Code SMS envoyé.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", error.message);
    }
  };

  const verifyCode = async () => {
    try {
      if (!confirmationResult) {
        Alert.alert("Erreur", "Veuillez d’abord envoyer un code.");
        return;
      }

      await confirmationResult.confirm(code);
      Alert.alert("Succès", "Connexion par téléphone réussie.");
      router.replace("/profile");
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion par téléphone</Text>

      <TextInput
        placeholder="Numéro de téléphone ex: +33612345678"
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
        <Text style={styles.buttonText}>Valider le code</Text>
      </Pressable>

      <div id="recaptcha-container"></div>
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
