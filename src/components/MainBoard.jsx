import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';
import Styles from '../styles.css';
import LoginForm from './LoginForm.jsx';


class MainBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      roomName: null,
      password: null,
      loggedin: false,
    };
    this.saveDrawingData = this.saveDrawingData.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeRoom = this.handleChangeRoom.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  saveDrawingData(data) {
    fetch('/save', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  handleChangeName(event) {
    console.log(event, "EVENT TARGET", event.target.value)
    this.setState({name: event.target.value});
  }

  handleChangeRoom(event) {
    console.log(event, "EVENT TARGET", event.target.value)
    this.setState({roomName: event.target.value});
  }

  handleChangePassword(event) {
    console.log(event, "EVENT TARGET", event.target.value)
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    console.log('A name was submitted: ', this.state.name, this.state.roomName, this.state.password );
    event.preventDefault();
    fetch('/login', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ name: this.state.name, roomName: this.state.roomName, password: this.state.password }),
    }).then(res => this.setState({loggedin: res}));
  }

  render() {
    if (this.state.loggedin) {
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
    if (!this.state.loggedin) {
      return (
        <LoginForm handleSubmit={this.handleSubmit} handleChangePassword={this.handleChangePassword} 
          handleChangeRoom={this.handleChangeRoom} handleChangeName={this.handleChangeName} 
          name={this.state.name} password={this.state.password} roomName={this.state.roomName} />
      )
    }
  }
}

export default MainBoard;
