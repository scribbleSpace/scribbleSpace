import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import Styles from '../styles.css';

class MainBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.saveDrawingData = this.saveDrawingData.bind(this);
  }

  saveDrawingData(data) {
    fetch('/save', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ data: data, roomName: this.state.roomName }),
    });
  }

  render() {
    return (
      <div className="mainCanvas">
        <CanvasDraw
          ref={canvasDraw => {
            this.saveableCanvas = canvasDraw;
          }}
          lazyRadius="1"
          brushRadius="4"
          canvasWidth="600px"
        />
        <br />
        <br />
        <button
          type="button"
          onClick={() => {
            this.saveDrawingData(this.saveableCanvas.getSaveData());
          }}
        >
          Save Me
        </button>
      </div>
    );
  }
}

export default MainBoard;
