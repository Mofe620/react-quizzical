import React, {useState, useEffect, useCallback} from 'react';
import Question from '../components/Question';
import { v4 as uuidv4 } from 'uuid';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);

  const getQuestions = useCallback(async () => {
    const request = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
    const response = await request.json();
    const questionSet = response.results;
    setQuestions(questionSet);
    return questionSet;
  },[])

  useEffect(() => {
   getQuestions()
  },[getQuestions])
  
  const success = [];
  function showAnswers(){
    const questionField = document.querySelector('.quiz');
    questionField.setAttribute('class', 'quiz mark');
    document.querySelector('.play_again').style.display = 'flex';
    document.querySelector('#submit').style.display = "none";

    //Count number of Correct Picks 
    // eslint-disable-next-line
    success.push(Score.filter(entry => entry.status == true)); 
    //console.log(success)
    //console.log(success[0].length);
    document.querySelector('#score').textContent = success[0].length;
  }

  const Score = [];
  function markQuestion(id, status){
    if (Score.some(entry => entry.id === id)) {
      let obj = Score.find(o => o.id === id);
      obj.status = status;
    } else {
      Score.push({id: id, status: status})
    }
    //console.log(Score)
  }

  return (
    <div className='quiz'>
      {questions && <h3>Answer 5 Questions</h3>}
      <div className="">
        {questions != null ? questions.map(question =>  <Question key={uuidv4()} id={question.question} giveRemark={markQuestion} raw={question} />) : "Loading..."} 
      </div>

      {questions && <button id='submit' onClick={showAnswers}>Check answers</button>}

      <div className="play_again">
        {questions && <p>You scored <span id='score'></span>/{questions.length} correct answers</p>}
        <button onClick={() => window.location.reload()}>Play again</button>
      </div>
    </div>
  )
}
