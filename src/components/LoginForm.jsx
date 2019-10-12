import React, { Component } from 'react';
import Styles from '../styles.css';

function LoginForm(props) {
  return (
    <div className="loginBox">
      <form onSubmit={props.handleSubmit}>
        <div className="inputBoxOnLoginComponent">
          <label>
            <input
              placeholder="Username"
              type="text"
              value={props.name}
              onChange={props.handleChangeName}
            />
          </label>
          <label>
            <input
              placeholder="Room Name"
              type="text"
              value={props.roomName}
              onChange={props.handleChangeRoom}
            />
          </label>
          <label>
            <input
              placeholder="Password"
              type="text"
              value={props.password}
              onChange={props.handleChangePassword}
            />
          </label>
          <input className="loginButton" type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
