import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import TargetCursor from './components/TargetCursor';

ReactDOM.render(
  <React.StrictMode>
  <App />
  <TargetCursor targetSelector=".cursor-target, button, .logo-fshop, .finalizar-compra" />
  </React.StrictMode>,
  document.getElementById('root')
);