import  illustrationImg from '../assets/images/illustration.svg'
import  logoImg from '../assets/images/logo.svg'
import  googleIconImg from '../assets/images/google-icon.svg'

import '../style/auth.scss'
import { Button } from '../components/Button'

export function Home(){
    return(
        <div id = "page-auth">
            <aside>
                <img src={illustrationImg} alt="" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>tire as dúvidas da su audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="letmeask" />
                    <button className="create-room" >
                        <img src={googleIconImg} alt="" />
                        Crie sua sala com o google
                    </button>
                    <div className = "separator">
                        ou entre em uma sala
                    </div>
                    <form action="submit">
                        <input 
                            type="text" 
                            placeholder = "digite o código da sala"
                        />
                        <Button>
                            Entrar na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}