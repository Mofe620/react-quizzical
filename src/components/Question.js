import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Question({data}) {
  const options = data.incorrect_answers;
  options.push(data.correct_answer);
  return (
    <>
        <div className='question'>
          <p>{data.question}</p>
          <ul>
           {options.map(option => <li key={uuidv4()}>{option}</li>)}
          </ul>
        </div>
    </>
  )
}
