import React from 'react';
import ReactDOM from 'react-dom';
import Styles from './styles.css';
import App from './App.jsx';

const Scibble = () => (
  <div>
    <App/>
  </div>
);

ReactDOM.render(<Scibble />, document.getElementById('root'));
