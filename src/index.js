import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Styles from './styles.css';
import App from './App.jsx';

const Scibble = () => (
  <div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>
);

ReactDOM.render(<Scibble />, document.getElementById('root'));
