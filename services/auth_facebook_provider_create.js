import { FacebookAuthProvider } from "firebase/auth";

const facebookProvider = new FacebookAuthProvider();

facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");

export { facebookProvider };

