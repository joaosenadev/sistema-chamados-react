import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import { FiGithub } from "react-icons/fi"


export default function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const { signUp, loadingAuth, signed } = useContext(AuthContext)

  useEffect(() => {
    if (signed) {
      navigate("/dashboard")
    }
  }, [signed]);


  async function handleRegister(e) {
    e.preventDefault()

    if (name !== "" && email !== "" && password !== "") {
      await signUp(email, password, name)
    }
    else {
      toast.error("Preencha todos os campos!")
    }
  }

  return (
    <section className="register-container">
      <Box onSubmit={handleRegister} component="form" className="register">
        <h1>Cadastrar</h1>

        <TextField type="text" label="Nome" fullWidth value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField type="email" label="E-mail" fullWidth value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField type="password" label="Senha" fullWidth value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {
          loadingAuth ? <LoadingButton loading type="submit" fullWidth size="large" variant="contained">
            Loading...
          </LoadingButton>
            :
            <Button type="submit" fullWidth size="large" variant="contained">
              Cadastrar
            </Button>
        }

        <Link to="/">Já possui uma conta ? Faça o login</Link>
      </Box>

      <div className="footer">
        <Link to="https://github.com/joaosenadev">
          <Tooltip title="GitHub">
            <IconButton color="primary">
              <FiGithub size={30} />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </section>
  )
}
