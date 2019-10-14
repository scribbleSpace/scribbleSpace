import React from 'react';
import ReactDOM from 'react-dom';
import Styles from './styles.css';
import MainBoard from './components/MainBoard.jsx';

const Index = () => (
  <div>
    <h1 className="logoMain">scribbleSpace</h1>
    <MainBoard />
  </div>
);

ReactDOM.render(<Index />, document.getElementById('root'));
