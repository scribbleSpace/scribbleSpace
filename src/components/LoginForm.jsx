
import React, { Component } from 'react';
import Styles from '../styles.css';

function LoginForm (props) {
    return(
        <form onSubmit={props.handleSubmit}>
          <label>
          Name:
            <input type="text" value={props.name} onChange={props.handleChangeName} />
          </label>
          <label>
          Room:
            <input type="text" value={props.roomName} onChange={props.handleChangeRoom} />
          </label>
          <label>
          Password:
            <input type="text" value={props.password} onChange={props.handleChangePassword} />
          </label>
            <input type="submit" value="Submit" />
        </form>
    )
}

export default LoginForm;
