import React from 'react';
import './App.css';
import AllServerDashboard from './Components/AllServerDashboard';
import Create from './Components/Create';
import Report from './Components/Report';
import View from './Components/View';

function App() {
  return (
    <div>
      <h1>Grit Signature Module</h1>
      <AllServerDashboard/>
      <Create/>
      <View/>
      <Report/>
    </div>
  );
}

export default App;
