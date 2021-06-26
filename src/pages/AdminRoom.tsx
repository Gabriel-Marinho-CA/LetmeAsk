import { Question } from "../components/Question"
import { useParams, useHistory } from 'react-router-dom'

import {useRoom} from '../hooks/useRoom'


import {RoomCode} from '../components/RoomCode'

import {Button} from '../components/Button'

import '../styles/room.scss';

import logoImg from '../assets/images/logo.svg'
import deleteImg  from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { database } from "../services/firebase"


//import { Container, Content, Title, Form, UserInfo } from './styles';


//==============================//

type RoomParams = {
  id: string;
}


export function AdminRoom(){
 // const {user} = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { title,questions} = useRoom(roomId);

  console.log(questions)


  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/');
  }



  async function handleDeleteQuestion (questionid: string){
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
       await database.ref(`rooms/${roomId}/questions/${questionid}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered : true,
    })
    
  }
  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted : true,
    })
  }


  return(
    <div id="page-room">
      <header>
        <div className = "content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code = {roomId}></RoomCode>
            <Button isOutlined onClick = {handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className = "room-tittle">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span> {questions.length} Pergunta(s)</span>}
          
        </div>

      <div className="question-list">
        {questions.map(question => {
          return(
            <Question
              key={question.id}
              content = {question.content}
              author = {question.author}
              isAnswered = {question.isAnswered}
              isHighlighted = {question.isHighlighted}
            >
                          
              {!question.isAnswered && (
                <>
                <button
                type ="button"
                onClick= {()=> handleCheckQuestionAsAnswered(question.id)} >
  
                <img src={checkImg } alt="Dar destaque á pergunta"/>
                </button>
                           
                <button
                type ="button"
                onClick= {()=> handleHighlightQuestion(question.id)}>
  
                    <img src={answerImg} alt="Marcar pergunta como respondida"/>
                </button>
                </>
              )}


              <button
              type ="button"
              onClick= {()=> handleDeleteQuestion(question.id)}
              >

                  <img src={deleteImg} alt="Remover pergunta"/>
              </button>
           </Question>
          );
        })}
        </div>
      </main>
    </div>
  )
}