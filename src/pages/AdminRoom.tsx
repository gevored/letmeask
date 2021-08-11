

import {useHistory, useParams} from 'react-router-dom'
import  logoImg from '../assets/images/logo.svg'
import  checkImage from '../assets/images/check.svg'
import  answerImg from '../assets/images/answer.svg'



import { RoomCode } from '../components/RoomCode'
import deleteImg from '../assets/images/delete.svg'
import {Question} from '../components/Question'

import '../style/room.scss'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../components/Button'
import { database } from '../services/firebase'

export function AdminRoom(){
    
    type RoomsParams = {
        id:string;
    }
    
    const history = useHistory()
    const params = useParams<RoomsParams>() 
    const roomId= params.id
    console.log(params.id)
    const {questions, title} = useRoom(roomId)
    
    
    
    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
          await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
      }

    
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isAnswered: true,
        })
    }

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isHighlighted: true,
        })
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code = {roomId}/>
                        <Button 
                        isOutlined
                        onClick = {handleEndRoom}
                        >
                            Encerrar Sala
                        </Button>
                    </div>
                </div>
            </header>

            <main >
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length>0 && <span>{questions.length} Perguntas</span>}
                </div>
                <div className="question-list">
                    {
                        questions.map((question)=>{
                            return(
                                <Question
                                key = {question.id}
                                content = {question.content}
                                author = {question.author}
                                isAnswered = {question.isAnswered}
                                isHighlighted = {question.isHighlighted}

                                >

                                {!question.isAnswered  && (
                                <> 
                                    <button
                                    type="button"
                                    onClick = {() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImage} alt="Marcar pergunta como respondida" />
                                    </button>

                                    <button
                                    type="button"
                                    onClick = {() => handleHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque à pergunta" />
                                    </button>
                                </>)}

                                <button
                                type="button"
                                onClick = {() => {handleDeleteQuestion(question.id)}}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                            )
                        })
                    }
                </div>
            </main>
        </div>
    )
}