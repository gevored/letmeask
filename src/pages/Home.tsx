
import {useHistory} from 'react-router-dom'
import  illustrationImg from '../assets/images/illustration.svg'
import  logoImg from '../assets/images/logo.svg'
import  googleIconImg from '../assets/images/google-icon.svg'

import '../style/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent , useState } from 'react'
import { database } from '../services/firebase'


export function Home(){

    const history = useHistory()
    const {user , signWithGoogle} = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom(){ 

        if(!user){
            await signWithGoogle()
        }
        history.push('/rooms/news')   
    }

    async function handleJoinRoom(event : FormEvent){
        event.preventDefault()
        
        if(roomCode.trim() ===''){
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode.trim()}`).get();
        console.log(roomRef.exists() ,roomCode.trim())

        if (!roomRef.exists()) {
            alert('Room does not exists.');
            return;
          }
      
          if (roomRef.val().endedAt) {
            alert('Room already closed.');
            return;
          }
      
          history.push(`/rooms/${roomCode}`);

    }

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
                    <button  onClick = {handleCreateRoom}  className="create-room" >
                        <img src={googleIconImg} alt="" />
                        Crie sua sala com o google
                    </button>
                    <div className = "separator">
                        ou entre em uma sala
                    </div>
                    <form 
                    onSubmit = {handleJoinRoom}
                    action="submit"
                    >
                        <input 
                            onChange = {e => setRoomCode(e.target.value)}
                            value = {roomCode}
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