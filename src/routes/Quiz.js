import React, {useEffect} from 'react';
import Question from '../components/Question';
import { v4 as uuidv4 } from 'uuid';

export default function Quiz() {
  const [questions, setQuestions] = React.useState(null);
  
  const getQuestions = React.useCallback(async () => {
    const request = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
    const response = await request.json();
    const questionSet = response.results;
    setQuestions(questionSet);
    return questionSet;
  },[])
  useEffect(() => {
   getQuestions()
  },[getQuestions])

  return (
    <div className='quiz'>
      <h3>Answer 5 Questions</h3>
      <div className="">
        {questions != null ? questions.map(question =>  <Question key={uuidv4()} data={question} />) : "Loading..."}
      </div>
     {questions && <button>Check answers</button>}
    </div>
  )
}
