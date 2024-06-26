// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import FullCalendarComponent from './FullCalendarComponent';

const App: React.FC = () => {
  const [url, setURL] = useState('');

  const testJson = async () => {
    let res = await fetch('./config.json')
    let result = await res.json();
    console.log(result.apiUrl);
    setURL(result.apiUrl);
  }

  testJson();
  return (
    <div className="App">
      <label>test{url}</label>
      <FullCalendarComponent />
    </div>
  );
};

export default App;