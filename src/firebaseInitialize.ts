import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDqFNUpDcHkGTKWhQeMM1EKtabBGq4j_nU",
  authDomain: "nimmt-49fb8.firebaseapp.com",
  databaseURL: "https://nimmt-49fb8-default-rtdb.firebaseio.com",
  projectId: "nimmt-49fb8",
  storageBucket: "nimmt-49fb8.appspot.com",
  messagingSenderId: "590475039860",
  appId: "1:590475039860:web:08c86d8f1266a907272d21",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
