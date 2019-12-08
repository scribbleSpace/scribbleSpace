import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import OptionBar from './OptionBar.jsx'

const io = require('socket.io-client');

const socket = io();

// CanvasDraw imports the third party canvas npm package.
// ReadMe docs located in node packages react-canvas-draw info on modifying the canvas app.

class MainBoard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className="mainCanvas"
        onMouseUp={this.props.broadcastData}
        onTouchEnd={this.props.broadcastData}
      >
        <CanvasDraw
          ref={canvasDraw => {
            this.props.saveableCanvas = canvasDraw;
          }}
          saveData={this.props.data}
          lazyRadius="1"
          brushRadius="4"
          canvasWidth="800px"
          immediateLoading="true"
        />

        <OptionBar 
          loadBoard = {this.props.loadBoard}
          saveDrawingData = {this.props.saveDrawingData}
          saveableCanvas = {this.props.saveableCanvas}
          leaveRoom = {this.props.leaveRoom}
        />

      </div>
    );
  }
}

export default MainBoard;
