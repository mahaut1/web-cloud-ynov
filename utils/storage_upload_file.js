import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const uploadToFirebase = async (uri, name) => {
  const fetchResponse = await fetch(uri);

  const blob = await fetchResponse.blob();

  const imageRef = ref(getStorage(), `images/${name}`);

  const uploadTask = await uploadBytes(imageRef, blob);

  const downloadURL = await getDownloadURL(uploadTask.ref);

  return downloadURL;
};
