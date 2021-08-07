
import { useState , FormEvent ,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import  logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import '../style/room.scss'

export function Room(){
    
    type RoomsParams = {
        id:string;
    }

    type FirebaseQuestions = Record<string,{
        author:{
            name: string;
            avatar:string;
        }
        content: string;
        isAbswered: boolean;
        isHighlighted: boolean;
    }>

    type Questions = {
        id:string;
        author:{
            name: string;
            avatar:string;
        };
        content: string;
        isAbswered: boolean;
        isHighlighted: boolean;
    }

    const {user} = useAuth()
    const [newQuestion, setNewQuestion] = useState('')

    const params = useParams<RoomsParams>() 
    const roomId= params.id
    const [questions, setQuestions] = useState<Questions[]>([])
    const [title, setTitle] = useState()

    useEffect(()=>{
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.once('value',room =>{
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

            const parseQuestions = Object.entries(firebaseQuestions).map(([key,value])=>{
                return{
                   id:key,
                   content:value.content,
                   author:value.author,
                   isAbswered: value.isAbswered,
                   isHighlighted:value.isHighlighted,
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parseQuestions)
        })
    }, [roomId])

    async function handleSendQuestion(event:FormEvent){
        event.preventDefault()

        if(newQuestion.trim() ===''){
            return
        }

        if(!user){
            throw new Error('youn must be logged in')
        }

        const question ={
            content:newQuestion,
            author:{
                name:user.name,
                avatar:user.avatar,
            },
            isHighlighted:false,
            isAnswered:false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)
        setNewQuestion('')
    }

    
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <RoomCode code = {roomId}/>
                </div>
            </header>

            <main >
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length>0 && <span>{questions.length} Perguntas</span>}
                </div>

                <form  onSubmit= {handleSendQuestion}>
                    <textarea 
                    placeholder = "O que vc quer perguntar ?"
                    onChange = {e => setNewQuestion(e.target.value)}
                    value = {newQuestion}
                    />
                    <div className="form-footer">
                    { user ? (
                        <div className="user-info">
                            <img src={user.avatar } />
                            <span>{user.name}</span>
                        </div>
                        ) : (
                        <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        ) 
                    }

                        <Button    type = "submit">
                            Enviar Pergunta
                        </Button>
                    </div>
                </form>
                {
                    JSON.stringify(questions)
                }
            </main>
        </div>
    )
}