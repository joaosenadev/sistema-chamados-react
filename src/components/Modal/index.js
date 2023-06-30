import "./modal.css"
import { IconButton, useTheme } from "@mui/material"
import { FiX } from "react-icons/fi"

export function Modal({ conteudo, close }) {

    const theme = useTheme()
    const color = theme.palette

    return (
        <div className="modal">
            <div className="container">

                <div className="title-modal">

                    <h2>Detalhes do Chamado</h2>
                    
                    <IconButton className="close" onClick={close}>
                        <FiX size={25} />
                    </IconButton>
                </div>

                <main>

                    <div className="row">
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>

                        <span>
                            Cadastrado em: <i>{conteudo.createdFormat}</i>
                        </span>
                    </div>


                    <div className="row">
                        <span>
                            Status: <i style={{
                                borderRadius: "4px",
                                color: "#fff",
                                backgroundColor: conteudo.status === "Aberto" ?
                                    color.thirty.main : "" || conteudo.status === "Atendido" ? color.primary.main : "#999"
                            }}>
                                {conteudo.status}
                            </i>
                        </span>
                    </div>

                    {conteudo.complemento !== "" && (
                        <>
                            <h3>Complemento</h3>
                            <p>
                                {conteudo.complemento}
                            </p>
                        </>
                    )}

                </main>
            </div>
            <div className="close-bg" onClick={close}></div>
        </div>
    )
}
