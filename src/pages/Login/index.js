import "./login.css"
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// MUI
import { LoadingButton } from "@mui/lab";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";

//Icons
import { FiGithub } from "react-icons/fi"

// Contexts
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";


export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, loadingAuth, signed } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (signed) {
      navigate("/dashboard")
    }
  }, [signed]);


  async function handleLogin(e) {
    e.preventDefault()

    if (email !== "" && password !== "") {
      await signIn(email, password)
    }
    else {
      toast.error("Preencha todos os campos!")
    }

  }

  return (
    <section className="login-container">
      <Box onSubmit={handleLogin} component="form" className="login">
        <h1>Login</h1>

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
              Acessar
            </Button>
        }

        <Link to="/register">Criar uma conta</Link>
      </Box>

      <div className="footer">
        <Link to="https://github.com/joaosenadev">
          <Tooltip title="GitHub">
            <IconButton color="primary">
              <FiGithub size={28} />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </section>
  )
}
