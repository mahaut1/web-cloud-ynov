import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import app from "../firebaseConfig";
import { updateUserPhotoUrl } from "../utils/auth_update_photo_url";
import { uploadToFirebase } from "../utils/storage_upload_file";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [image, setImage] = useState(null);

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

      setUser({
        ...auth.currentUser,
        displayName,
        photoURL,
      });

      alert("Profil mis à jour !");
    } catch (error) {
      alert(error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);

      const fileName = uri.split("/").pop();

      try {
        const downloadURL = await uploadToFirebase(uri, fileName);

        const res = await updateUserPhotoUrl(downloadURL);

        if (res) {
          setPhotoURL(downloadURL);

          setUser({
            ...user,
            photoURL: downloadURL,
          });

          alert("Photo mise à jour !");
        } else {
          alert("Erreur lors de la mise à jour de la photo.");
        }
      } catch (error) {
        alert(error.message);
      }
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

      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.image} />
      ) : null}

      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Choisir une image</Text>
      </Pressable>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Text>Email : {user.email || "Non renseigné"}</Text>
      <Text>UID : {user.uid}</Text>
      <Text>Email vérifié : {user.emailVerified ? "Oui" : "Non"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={styles.input}
        placeholder="URL photo"
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: "#16a34a",
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
