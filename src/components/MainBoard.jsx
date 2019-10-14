import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import Styles from '../styles.css';
import LoginForm from './LoginForm.jsx';

const io = require('socket.io-client');

const socket = io();

// CanvasDraw imports the third party canvas npm package.
// ReadMe docs located in node packages react-canvas-draw info on modifying the canvas app.

class MainBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      roomName: null,
      password: null,
      loggedin: false,
      socketId: null,
      data: null,
    };
    this.saveDrawingData = this.saveDrawingData.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeRoom = this.handleChangeRoom.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.loadBoard = this.loadBoard.bind(this);
    this.broadcastData = this.broadcastData.bind(this);
  }

  // On componentDidMount life cycle method, these events to occur.
  // -Socket connection is created
  // - State is updated with unique socket ID
  // - This.state.data is updated with broadcast data.

  componentDidMount() {
    socket.on('connect', () => {
      this.setState({ socketId: socket.id });
    });
    socket.on('broadcast', data => {
      this.setState({ data });
    });
  }

  //
  // Method Sends canvas drawing data to server
  // Must be invoked within the appropriate React component
  saveDrawingData(data) {
    fetch('/save', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  // HandleChangeName,HandleChangeRoom , HandleChangePassword - Obtains the name,room,and password from login form.

  handleChangeName(event) {
    console.log(event, 'EVENT TARGET', event.target.value);
    this.setState({ name: event.target.value });
  }

  handleChangeRoom(event) {
    console.log(event, 'EVENT TARGET', event.target.value);
    this.setState({ roomName: event.target.value });
  }

  handleChangePassword(event) {
    console.log(event, 'EVENT TARGET', event.target.value);
    this.setState({ password: event.target.value });
  }
  // Handle submit
  // submits data from state and sends to server.

  handleSubmit(event) {
    console.log(
      'A name was submitted: ',
      this.state.name,
      this.state.roomName,
      this.state.password
    );
    event.preventDefault();
    fetch('/login', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        roomName: this.state.roomName,
        password: this.state.password,
        socketId: this.state.socketId,
      }),
    })
      // .then(db => db.json())
      .then(res => {
        console.log(`${this.state.name} is in room: ${this.state.roomName}`);
        return this.setState({ loggedin: res });
      });
  }

  // Leave Room sets the state of "Logged in " to null.

  leaveRoom() {
    // fetch('/leaveroom', {
    //   method: 'PUT',
    // });
    this.setState({ loggedin: null });
  }

  // Gets data from dateBase and renders canvas with data.

  loadBoard(loadCommand) {
    console.log('roomname', this.state.roomName);
    fetch('/load', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        roomName: this.state.roomName,
        password: this.state.password,
        socketId: this.state.socketId,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const db = JSON.stringify(data);
        console.log('loading ', db);
        this.setState({ data: db });
        // this.saveableCanvas.loadSaveData(data, true);
      });
  }

  // BroadcastData - Emits canvas data via the sockets to the server

  broadcastData(event) {
    const saveData = this.saveableCanvas.getSaveData();
    socket.emit('transfer', saveData);
  }

  // If this.state.loggedin is "truthy" it will render drawing board
  // If "falsey" it will render the login in screen.
  //
  // To modify CanvasDraw component pass in appropriate jsx attributes.
  // Consult the react-canvas-draw readme located in node modules for more information/specifics.
  //
  render() {
    if (this.state.loggedin) {
      return (
        <div
          className="mainCanvas"
          onMouseUp={this.broadcastData}
          onTouchEnd={this.broadcastData}
        >
          <CanvasDraw
            ref={canvasDraw => {
              this.saveableCanvas = canvasDraw;
            }}
            saveData={this.state.data}
            lazyRadius="1"
            brushRadius="4"
            canvasWidth="800px"
            immediateLoading="true"
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
    if (!this.state.loggedin) {
      return (
        <LoginForm
          handleSubmit={this.handleSubmit}
          handleChangePassword={this.handleChangePassword}
          handleChangeRoom={this.handleChangeRoom}
          handleChangeName={this.handleChangeName}
          name={this.state.name}
          password={this.state.password}
          roomName={this.state.roomName}
        />
      );
    }
  }
}

export default MainBoard;
