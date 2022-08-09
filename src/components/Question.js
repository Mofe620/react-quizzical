import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import he from "he";

export default function Question({raw, giveRemark, id}) {

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
   
  const options = []//React.useMemo(() =>,[data]); //useMemo requires a proper dependency else it'll likely act twice
  incorrect.forEach(value => options.push({
    content: value,
    status: false,
    picked: false
  }));
  options.push({
    content: correct,
    status: true,
    picked: false
  });
  //status indicates if an option is the correct answer or not
  //picked indicates if an option has been selected by the user

  //SHUFFLE OPTIONS
  const [shuffledOptions, setShuffledOptions] = React.useState()
  const shuffle = ()=>{
    return options.sort(()=>  Math.random() - 0.5);
    // eslint-disable-next-line
  };

  // eslint-disable-next-line
  const shuffled = React.useMemo(() => shuffle, [data])

  React.useEffect(() => {
    setShuffledOptions(shuffled)
    // eslint-disable-next-line
  }, [])
  
  
  //SELECT OPTION
  function selectOption(e, value){
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
        if(value === correct){
          giveRemark(id, true);
        } else {
          giveRemark(id, false);
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
        {shuffledOptions && <ul>
          {shuffledOptions.map(option => <li onClick={(e)=>{selectOption(e, option.content)}} className={option.status ? "correct" : "incorrect"} key={uuidv4()}>{option.content}</li>)}
        </ul>}
        <input type="hidden" name="" value={correct} />
      </div>
    </>
  )
}

//WHEN RESULTS ARE DISPLAYED
//Options with class of correct i.e status of true will be green
//Options with class of incorrect and picked i.e status of false, picked of true will be red
//Options with class of incorrect i.e status of false but picked of false will remain the same