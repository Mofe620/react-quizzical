import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import he from "he";

export default function Question({raw, success, setSuccess}) {

  const json = JSON.stringify(raw);
  const format1 = json.replace(/\\n/g, "\\n")  
  .replace(/\\'/g, "\\'")
  .replace(/\\"/g, '\\"')
  .replace(/\\&/g, "\\&")
  .replace(/\\r/g, "\\r")
  .replace(/\\t/g, "\\t")
  .replace(/\\b/g, "\\b")
  .replace(/\\f/g, "\\f")
  .replace(/&quot;/g,"\\\""); 
  const format2 = he.decode(format1); //convert html special entities like &euml; or &apos; to the proper character
  const data = JSON.parse(format2);
  const incorrect = data.incorrect_answers;
  const correct = data.correct_answer;
  const options = [];
  incorrect.forEach(value => options.push({
    content: value,
    status: false,
    picked: false
  }));
  options.push({
    content: correct,
    status: true,
    picked: false,
    id: uuidv4()
  });
  //status indicates if an option is the correct answer or not
  //picked indicates if an option has been selected by the user

  //SHUFFLE OPTIONS
  const shuffledOptions = options.sort(function () {
    return Math.random() - 0.5;
  });
  
  //SELECT OPTION
  function selectOption(e, value, id){
    for (let i = 0; i < shuffledOptions.length; i++) {
      if (shuffledOptions[i].content === value){
        shuffledOptions[i].picked = true;
        const choice = e.target;
        choice.classList.add('selected', 'picked');//selected is referring to the UI changes that ocuur when an option is clicked. Picked as a class helps to display the red color for those picked answers that are wrong when user submits
        const parent = choice.parentElement; //selects parent <ul></ul>
        const childTags = parent.children; //selects all <li></li> tags within the parent
        for (let v = 0; v < childTags.length; v++) {
          if(childTags[v] !== choice){
            childTags[v].classList.remove('selected');
          }
        }
        if(shuffledOptions[i].status === true){
          if(!success.includes(value)){
            success.push(value);
            setSuccess(success);
            console.log(success);
          }
        } else {
          //if first attempt is wrong, do nothing
          //if user changes right answer to wrong answer, remove right answer and update success array
          const optionsArray = shuffledOptions.map(option => option.content);
          // eslint-disable-next-line
          const common = optionsArray.filter(element => success.includes(element));
          console.log(common);
          if(common.some(r=> optionsArray.includes(r))){
            const modify = success.filter(item => !common.includes(item));
            setSuccess(modify);
            console.log(success);
          }
        }
      } else {
        shuffledOptions[i].picked = false;
      }
    }
  }

  return (
    <>
      <div className='question'>
        <p>{data.question}</p>
        <ul>
          {shuffledOptions.map(option => <li onClick={(e)=>{selectOption(e, option.content, option.id)}} className={option.status ? "correct" : "incorrect"} key={uuidv4()}>{option.content}{option.selected}</li>)}
        </ul>
      </div>
    </>
  )
}

//WHEN RESULTS ARE DISPLAYED
//Options with class of correct i.e status of true will be green
//Options with class of incorrect and picked i.e status of false, picked of true will be red
//Options with class of incorrect i.e status of false but picked of false will remain the same