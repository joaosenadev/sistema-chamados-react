import { useState } from "react"

// Components
import { Header } from "../../components/Header"
import { Title } from "../../components/Title"
import { FiUser } from "react-icons/fi"
import { Button, TextField } from "@mui/material"

// Firebase
import { db } from "../../services/firebaseConnection"
import { addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify"
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

export default function Customers() {

    const { user } = useContext(AuthContext)
    const [nome, setNome] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [endereco, setEndereco] = useState("")


    async function handleRegister(e) {
        e.preventDefault()

        if (nome !== "" && cnpj !== "" && endereco !== "") {
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco,
                userID: user.uid
            })
                .then(() => {
                    setNome("")
                    setCnpj("")
                    setEndereco("")
                    toast.success("Cliente adicionado com sucesso!")
                })
                .catch(() => {
                    toast.error("Erro ao fazer o cadastro")
                })
        }
        else {
            toast.warning("Preencha todos os campos!!")
        }
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <div className="form-profile-input">

                            <label>Nome fantasia</label>
                            <TextField size="small" type="text" value={nome}
                                placeholder="Nome da empresa"
                                onChange={(e) => setNome(e.target.value)}
                            />

                            <label>CNPJ</label>
                            <TextField size="small" type="text" value={cnpj}
                                placeholder="Digite o CNPJ"
                                onChange={(e) => setCnpj(e.target.value)}
                            />

                            <label>Endereço</label>
                            <TextField size="small" type="text" value={endereco}
                                placeholder="Endereço da empresa"
                                onChange={(e) => setEndereco(e.target.value)}
                            />

                            <Button variant="contained" type="submit">Adicionar</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
