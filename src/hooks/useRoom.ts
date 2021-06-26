import {useState, useEffect,} from 'react'
import {database} from '../services/firebase'
import { useAuth} from '../hooks/useAuth'
//============== //

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string;
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean;
  likes: Record<string,{
    authorId: string;
  } > 

  //Record => objeto, mas sem saber os campos
  // Record <string> => chave do objeto é uma string
}>


type QuestionType = {
  id: string;
  author: {
    name: string,
    avatar: string;
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean;
  likeCount : number;
  likeId: string | undefined;
}

export function useRoom (roomId: string){
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
  

    // once => uma consulta

    // on => realtime

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      // const firebaseQuestions = databaseRoom.questions as FirebaseQuestions;
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {};
      // const parsedQuestions = Object.entries(firebaseQuestions)
      // Object.entries => transforma objeto em vetor
      // room.questions ?? {} => se estiver vazio
      
      // const parsedQuestions = Object.entries(firebaseQuestions).map(value => {
      //   // value => value[0] -> chave
      //   // value => value[1] -> valor
      // });

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return { questions, title }
}
// parsedQuestions
// parsedQuestions