import { useContext, useEffect, useState } from "react"
import "./dashboard.css"
import { Header } from "../../components/Header"
import { Title } from "../../components/Title"
import { Link } from "react-router-dom"
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch, FiTrash } from "react-icons/fi"
import { Button, CircularProgress, IconButton, Tooltip, useTheme } from "@mui/material"

// Firebase
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
// Date format
import { format } from "date-fns"
import { Modal } from "../../components/Modal"
import { AuthContext } from "../../contexts/auth"
import { toast } from "react-toastify"

const listRef = collection(db, "chamados")

export default function Dashboard() {

  const theme = useTheme()
  const color = theme.palette
  const { user } = useContext(AuthContext)

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  const [loadingMore, setLoadingMore] = useState(false)
  const [lastDocs, setLastDocs] = useState()

  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState()

  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy("created", "desc"), where("userID", "==", user.uid), limit(5))

      const querySnapshot = await getDocs(q)
      setChamados([])
      await updateState(querySnapshot)

      setLoading(false)
    }

    loadChamados()

    return () => { }

  }, []);


  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0


    if (!isCollectionEmpty) {
      let lista = []

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          cliente: doc.data().cliente,
          clienteID: doc.data().clienteID,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          assunto: doc.data().assunto,
          status: doc.data().status,
          complemento: doc.data().complemento,
        })
      })

      //Pegando o ultimo item
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc)

    }
    else {
      setIsEmpty(true)
    }

    setLoadingMore(false)

  }

  async function handleMore() {
    setLoadingMore(true)


    const q = query(listRef, orderBy("created", "desc"), where("userID", "==", user.uid), startAfter(lastDocs), limit(5))
    const querySnapshot = await getDocs(q)

    await updateState(querySnapshot)

  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  async function handleDeleteTicket(id) {

    await deleteDoc(doc(listRef, id))
      .then(() => {
        toast.success("Chamado deletado com sucesso!")
        window.location.reload()
        
      })
      .catch(() => {
        toast.error("Erro ao deletar chamado!")
      })
  }


  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <CircularProgress />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>

          {chamados.length === 0 ? (
            <div className="container dashboard">
              <h1>Nenhum chamado encontrado.</h1>
              <Link to="/new" style={{ color: "#fff", float: "right", marginBottom: "15px" }}>
                <Button color="thirty" variant="contained" startIcon={<FiPlus size={25} />}>
                  Novo Chamado
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" style={{ color: "#fff", float: "right", marginBottom: "15px" }}>
                <Button color="thirty" variant="contained" startIcon={<FiPlus size={25} />}>
                  Novo Chamado
                </Button>
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>

                <tbody>
                  {chamados.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge"
                          style={{
                            backgroundColor: item.status === "Aberto" ?
                              color.thirty.main : "" || item.status === "Atendido" ? color.primary.main : "#999"
                          }}>
                          {item.status}
                        </span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormat}</td>
                      <td data-label="#">
                        <Tooltip title="Pesquisar">
                          <IconButton onClick={() => toggleModal(item)} color="primary" size="large" className="action">
                            <FiSearch size={20} />
                          </IconButton>
                        </Tooltip>

                        <Link to={`/new/${item.id}`}>
                          <Tooltip title="Editar">
                            <IconButton color="secondary" size="large" className="action">
                              <FiEdit2 size={20} />
                            </IconButton>
                          </Tooltip>
                        </Link>

                        <Tooltip title="Excluir">
                          <IconButton color="error" onClick={() => handleDeleteTicket(item.id)} size="large" className="action">
                            <FiTrash size={20} />
                          </IconButton>
                        </Tooltip>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && <Button variant="outlined" onClick={handleMore}>Buscar Mais</Button>}
            </>
          )}
        </>
      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}

    </div >
  )
}
