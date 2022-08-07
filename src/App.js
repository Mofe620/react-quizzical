import React from 'react';
import { Link } from "react-router-dom";
import './index.css';

function App() {
  return (
    <div className="home">
      <h3>Quizzical</h3>
      <p>Some description if needed</p>
      <Link to="/quiz"><button>Start quiz</button></Link>
    </div>
  );
}

export default App;
