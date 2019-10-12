import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import Styles from '../styles.css';

class MainBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.saveDrawingData = this.saveDrawingData.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.loadBoard = this.loadBoard.bind(this);
  }

  saveDrawingData(data) {
    fetch('/save', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  leaveRoom() {
    fetch('/leaveroom', {
      method: 'PUT',
    });
  }

  loadBoard(loadCommand) {
    fetch('/load', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        this.saveableCanvas.loadSaveData(data.data, true);
      });
  }

  // / loadSaveData(saveData: String, immediate: Boolean)

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
        <button type="button" onClick={this.loadBoard}>
          LoadRoom
        </button>

        <button
          type="button"
          onClick={() => {
            this.saveDrawingData(this.saveableCanvas.getSaveData());
          }}
        >
          Save Me
        </button>
        <button
          type="button"
          onClick={() => {
            this.saveDrawingData(this.saveableCanvas.clear());
          }}
        >
          Clear
        </button>
        <button type="button" onClick={this.leaveRoom}>
          Leave Room
        </button>
      </div>
    );
  }
}

export default MainBoard;
