import React from 'react';
// Creates LoginForm, allows for input of username,password, and room number.
function LoginForm(props) {
  return (
    <div className="loginBox">

      <form onSubmit={props.handleSubmit}>
        <div className="inputBoxOnLoginComponent">
          <label>
            {/* Username input field */}
            <input
              placeholder="Username"
              type="text"
              value={props.name}
              onChange={props.handleChangeName}
            />
          </label>
          <label>
            {/* Room name input field */}
            <input
              placeholder="Room Name"
              type="text"
              value={props.roomName}
              onChange={props.handleChangeRoom}
            />
          </label>
          <label>
            {/* Password input field */}
            <input
              placeholder="Password"
              type="text"
              value={props.password}
              onChange={props.handleChangePassword}
            />
          </label>
          {/* Main submit button */}
          <input id="loginButton" type="submit" value="Login" />
        </div>
      </form>
      <img id="scribbleLogo" src="scribble-svgrepo-com.svg" alt="" />
    </div>
  );
}

export default LoginForm;
