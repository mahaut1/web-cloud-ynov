import { router } from "expo-router";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import app from "../firebaseConfig";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");
      setPhotoURL(currentUser.photoURL || "");
    });

    return unsubscribe;
  }, []);

  const handleUpdateProfile = async () => {
    const auth = getAuth(app);

    if (!auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });

      setUser({ ...auth.currentUser });
      alert("Profil mis à jour !");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth(app);

    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>

      <Text>Email : {user.email || "Non renseigné"}</Text>
      <Text>UID : {user.uid}</Text>
      <Text>Email vérifié : {user.emailVerified ? "Oui" : "Non"}</Text>
      <Text>Nom actuel : {user.displayName || "Non renseigné"}</Text>
      <Text>Photo URL : {user.photoURL || "Non renseignée"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={styles.input}
        placeholder="URL de la photo"
        value={photoURL}
        onChangeText={setPhotoURL}
      />

      <Pressable style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Mettre à jour le profil</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
  },
  logoutButton: {
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
