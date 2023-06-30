import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyADKwGwxbdXEDFd9AjaOlphQKExaSAZT88",
    authDomain: "sistemachamados-84c37.firebaseapp.com",
    projectId: "sistemachamados-84c37",
    storageBucket: "sistemachamados-84c37.appspot.com",
    messagingSenderId: "308261049622",
    appId: "1:308261049622:web:41eb0e8888ac72fee3ac37"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }