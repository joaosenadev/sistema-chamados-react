import { createContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConnection"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({})

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const LOCAL_STORAGE_KEY = "@tickets"
    const navigate = useNavigate()

    useEffect(() => {
        async function loadUser() {
            const storageUser = localStorage.getItem(LOCAL_STORAGE_KEY)

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(true)
            }

            setLoading(false)

        }

        loadUser()

    }, []);

    // Logar usuario
    async function signIn(email, password) {
        setLoadingAuth(true)

        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid

                const docRef = doc(db, "users", uid)
                const docSnap = await getDoc(docRef)

                let data = {
                    uid: uid,
                    nome: docSnap.data().nome,
                    email: value.user.email,
                    avatarUrl: docSnap.data().avatarUrl,
                }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success("Bem vindo(a) de volta :D")
                navigate("/dashboard")

            })
            .catch((error) => {
                const errorCode = error.code

                switch (errorCode) {
                    case "auth/wrong-password":
                        toast.error("Senha incorreta!")
                        break;
                    case "auth/user-not-found":
                        toast.error("Usuário não encontrado!")
                        break;
                }
                setLoadingAuth(false)
            })
    }

    // Cadastrar novos usuarios
    async function signUp(email, password, name) {
        setLoadingAuth(true)

        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid

                await setDoc(doc(db, "users", uid), {
                    nome: name,
                    avatarUrl: null,
                })
                    .then(() => {
                        let data = {
                            uid: uid,
                            nome: name,
                            email: value.user.email,
                            avatarUrl: null
                        }

                        setUser(data)
                        storageUser(data)
                        setLoadingAuth(false)
                        navigate("/dashboard")
                        toast.success("Seja bem vindo ao sistema :D")
                    })
            })
            .catch((error) => {
                const errorCode = error.code

                switch (errorCode) {
                    case "auth/email-already-in-use":
                        toast.error("O E-mail já está sendo ultilizado!")
                        break
                    case "auth/weak-password":
                        toast.error("A senha deve obter no mínimo 6 caracteres!")
                        break
                    default:
                        toast.error("Erro ao fazer o login.")
                        break
                }
                setLoadingAuth(false)
            })
    }


    function storageUser(data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    }

    async function logout() {
        await signOut(auth)
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}