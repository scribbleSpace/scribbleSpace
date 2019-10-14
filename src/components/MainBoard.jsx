import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import Styles from '../styles.css';
import LoginForm from './LoginForm.jsx';

const io = require('socket.io-client');

const socket = io();

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
    this.throttle = this.throttle.bind(this);
    this.broadcastData = this.broadcastData.bind(this);
  }

  componentDidMount() {
    socket.on('connect', () => {
      // console.log('socket?', socketId);
      this.setState({ socketId: socket.id });
      // socket.emit('transfer', [1,2,3]);
    });
    socket.on('broadcast', data => {
      console.log(data);
      // if(!this.props.intervalId){
      this.setState({ data });
      // }
      // this.saveableCanvas.loadSaveData(data, true);
    });
  }

  saveDrawingData(data) {
    fetch('/save', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

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

  leaveRoom() {
    fetch('/leaveroom', {
      method: 'PUT',
    });
  }

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
  broadcastData(event) {
    // console.log('hi........');
    let saveData = this.saveableCanvas.getSaveData();
    // console.log('broadcasting:', this.saveableCanvas.getSaveData());
    socket.emit('transfer', saveData);
    console.log('this is set interval');
  }

  throttle(func, delay) {
    let start = new Date().getTime();
    return function(...args) {
      let now = new Date().getTime();
      if (delay < now - start) {
        return func(...args);
      }
    };
  }
  // / loadSaveData(saveData: String, immediate: Boolean)

  render() {
    // let broadcaster = this.throttle(this.broadcastData, 50);
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
            canvasWidth="600px"
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
