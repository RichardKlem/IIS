import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [personTableData, setPersonTableData] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  useEffect(() => {
    fetch('/person').then(res => res.json()).then(data => {
      setPersonTableData(data.table);
    });
  }, []);



  return (
    <div className="App">
      <header className="App-header">

        Hello World

        <p>The current time is {currentTime}.</p>
	<p></p>
	<p>Data in table: {personTableData}</p>
      </header>
    </div>
  );
}

export default App;
