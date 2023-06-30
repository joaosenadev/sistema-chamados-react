import { Header } from "../../components/Header";
import { Title } from "../../components/Title";

import { FiSettings, FiUpload } from "react-icons/fi";
import avatarImage from "../../assets/avatar.png"
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function Profile() {

    const { user, storageUser, setUser, logout } = useContext(AuthContext)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)


    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type === "image/jpeg" || image.type === "image/png") {
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            } else {
                toast.warning("Envie uma imagem do tipo JPEG ou PNG ")
                setImageAvatar(null)
                return
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
                    let urlFoto = downloadUrl

                    const docRef = doc(db, "users", user.uid)
                    await updateDoc(docRef, {
                        avatarUrl: urlFoto,
                        nome: nome,
                    })
                        .then(() => {
                            let data = {
                                ...user,
                                nome: nome,
                                avatarUrl: urlFoto,
                            }
                            setUser(data)
                            storageUser(data)
                            toast.success("Atualizado com sucesso!")
                        })
                })

            })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (imageAvatar === null && nome !== "") {
            // Atualizar apenas o nome do usuario
            const docRef = doc(db, "users", user.uid)

            await updateDoc(docRef, {
                nome: nome,
            })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                    }
                    setUser(data)
                    storageUser(data)
                    toast.success("Atualizado com sucesso!")
                })
        } else if (nome !== "" && imageAvatar !== null) {
            // Atualizar o nome e a imagem
            handleUpload()
        }
    }


    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Minha conta">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={35} />
                            </span>

                            <input type="file" accept="image/*" onChange={handleFile} /> <br />
                            {avatarUrl === null ? (
                                <img width={250} height={250} src={avatarImage} alt="foto de perfil" />
                            ) : (
                                <img width={250} height={250} src={avatarUrl} alt="foto de perfil" />
                            )}
                        </label>

                        <div className="form-profile-input">

                            <label>Nome</label>
                            <TextField size="small" type="text" value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />

                            <label>Email</label>
                            <TextField size="small" type="text" value={email} disabled />

                            <Button variant="contained" type="submit">Salvar</Button>
                        </div>
                    </form>
                </div>

                <div className="container">
                    <Button color="error" onClick={() => logout()} className="logout-btn" variant="outlined">
                        Sair
                    </Button>
                </div>


            </div>
        </div>
    )
}
