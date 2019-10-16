import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import MainBoard from './components/MainBoard';
import LoginForm from './components/LoginForm';


const io = require('socket.io-client');
const socket = io();

class App extends Component {

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
    event.preventDefault();

    console.log(
      'A name was submitted: ',
      this.state.name,
      this.state.password
    );

		fetch('/login', {
			headers: { 'Content-type': 'application/json' },
			method: 'POST',
			body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      })
		})
		.then(data => data.json())
		.then(data => console.log(data))
		.catch(err=> console.log(err))
  }
  // Leave Room sets the state of "Logged in " to null.

  leaveRoom() {
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

  render() {    
		return (
      <LoginForm 
        handleSubmit= {this.handleSubmit}
        name= {this.name}
        handleChangeName= {this.handleChangeName}
        password = {this.password}
        handleChangePassword = {this.handleChangePassword}
      />
		)
  }
}

export default App;


// const mainBoard = () => {
  //   return (
  //   <div>
  //     <h1 className="logoMain">scribbleSpace</h1>
  //     <MainBoard 
  //       broadcastData = {this.state.broadcastData}
  //       saveableCanvas = {this.state.saveableCanvas}
  //       data = {this.state.data}
  //       loadBoard = {this.state.loadBoard}
  //       saveDrawingData = {this.state.saveDrawingData}
  //       leaveRoom = {this.state.leaveRoom}
  //     />
  //   </div>
  //   )
  // }