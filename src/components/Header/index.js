import "./header.css"
import AvatarImg from "../../assets/avatar.png"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

import { FiUser, FiSettings, FiHome } from "react-icons/fi"
import { Button } from "@mui/material"

export function Header() {

    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div className="sidebar-image">
                <img src={user.avatarUrl === null ? AvatarImg : user.avatarUrl} alt="Foto do usuario" />
            </div>

            <section className="sidebar-links">
                <Link to="/dashboard">
                    <Button fullWidth style={{ color: "#ddd" }}
                        size="large" startIcon={<FiHome size={24} />}>
                        Chamados
                    </Button>
                </Link>

                <Link to="/customers">
                    <Button fullWidth style={{ color: "#ddd" }}
                        size="large" startIcon={<FiUser size={24} />}>
                        Clientes
                    </Button>
                </Link>

                <Link to="/profile">
                    <Button fullWidth style={{ color: "#ddd" }}
                        size="large" startIcon={<FiSettings size={24} />}>
                        Perfil
                    </Button>
                </Link>
            </section>
        </div>
    )
}
