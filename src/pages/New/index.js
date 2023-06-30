import { useContext, useEffect, useState } from "react"

// Components
import { Header } from "../../components/Header"
import { Title } from "../../components/Title"

import { FiEdit2, FiPlus } from "react-icons/fi"
import { Button, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material"
import { AuthContext } from "../../contexts/auth"
import { db } from "../../services/firebaseConnection"
import { collection, getDoc, getDocs, doc, addDoc, updateDoc, where, query } from "firebase/firestore"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"


const listRef = collection(db, "customers")

export default function New() {
  
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true)
  const [customerSelected, setCustomersSelected] = useState(0)

  const [status, setStatus] = useState("Aberto")
  const [assunto, setAssunto] = useState("Suporte")
  const [complemento, setComplemento] = useState("")
  const [idCustomer, setIdCustomer] = useState(false)


  useEffect(() => {
    async function loadCustomers() {
      const q = query(listRef, where("userID", "==", user.uid))
      const querySnapshot = await getDocs(q)
        .then((snapshot) => {

          let lista = []

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
              userID: doc.data().userID,
            })
          })

          if (snapshot.docs.size === 0) {
            console.log("Nenhuma empresa encontrada")
            setCustomers([{ id: "1", nomeFantasia: "FREELA" }])

            setLoadCustomer(false)
            return
          }

          setCustomers(lista)
          setLoadCustomer(false)

          if (id) {
            loadId(lista)
          }

        })
        .catch((error) => {
          console.log("Erro ao localizar os clientes", error)
          setLoadCustomer(false)
          setCustomers([{ id: "1", nomeFantasia: "FREELA" }])
        })
    } 

    loadCustomers()
  }, [id]);


  async function loadId(lista) {
    const docRef = doc(db, "chamados", id)
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setComplemento(snapshot.data().complemento)
        setStatus(snapshot.data().status)


        let index = lista.findIndex(item => item.id === snapshot.data().clienteID)
        setCustomersSelected(index)
        setIdCustomer(true)

      })
      .catch((error) => {
        console.log(error)
        setIdCustomer(false)
      })
  }


  function handleOptionChange(e) {
    setStatus(e.target.value)
  }

  function handleAssuntoChange(e) {
    setAssunto(e.target.value)
  }

  function handleChangeCustomers(e) {
    setCustomersSelected(e.target.value)
  }

  async function handleRegisterTicket(e) {
    e.preventDefault()

    if (idCustomer) {
      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteID: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userID: user.uid,
      })
        .then(() => {
          toast.success("Chamado atualizado com sucesso!")
          setCustomersSelected(0)
          setComplemento("")
          navigate("/dashboard")
        })
      return
    }

    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteID: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userID: user.uid,
    })
      .then(() => {
        setComplemento("")
        setCustomersSelected(0)
        toast.success("Chamado registrado com sucesso!")
      })
      .catch((error) => {
        toast.error("Erro ao registrar chamado!")
        console.log("Erro ao registrar chamado", error)
      })
  }


  return (
    <div>
      <Header />

      <div className="content">
        <Title name={id ? "Editar Chamado" : "Novo Chamado"}>
          {id ? <FiEdit2 size={25} /> : <FiPlus size={25} />}
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegisterTicket}>
            <label>Clientes</label>
            {
              loadCustomer ? (
                <TextField disabled value="Carregando..." />
              ) : (
                <Select value={customerSelected} onChange={handleChangeCustomers}>
                  {customers.map((item, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {item.nomeFantasia}
                      </MenuItem>
                    )
                  })}
                </Select>
              )
            }


            <label>Assuntos</label>
            <Select value={assunto} onChange={handleAssuntoChange}>
              <MenuItem value="Suporte">Suporte</MenuItem>
              <MenuItem value="Visita Tecnica">Visita Tecnica</MenuItem>
              <MenuItem value="Finaceiro">Finaceiro</MenuItem>
            </Select>

            <div style={{ marginTop: "20px"}}>
              <FormLabel id="demo-radio-buttons-group-label">Status</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                <FormControlLabel value="Aberto" control={<Radio />} label="Em Aberto"
                  checked={status === "Aberto"}
                  onChange={handleOptionChange}
                />
                <FormControlLabel value="Progresso" control={<Radio />} label="Progresso"
                  checked={status === "Progresso"}
                  onChange={handleOptionChange}
                />
                <FormControlLabel value="Atendido" control={<Radio />} label="Atendido"
                  checked={status === "Atendido"}
                  onChange={handleOptionChange}
                />
              </RadioGroup>
            </div>

            <label>Complemento</label>
            <TextField placeholder="Descreva seu problema (opcional)" minRows={4} multiline
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <Button type="submit" style={{ margin: "15px 0" }} variant="contained" size="medium">
              {id ? "Salvar" : "Registrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
