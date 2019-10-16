import React from 'react';

function OptionBar (props) {
    <div className="buttonContainer">
        <button
            className="canvasButtons"
            type="button"
            onClick={props.loadBoard}
        >
            <h6>Load Room</h6>
        </button>

        <button
            type="button"
            className="canvasButtons"
            onClick={() => {
            props.saveDrawingData(props.saveableCanvas.getSaveData());
            }}
        >
            <h6>Save Room</h6>
        </button>
        <button
            type="button"
            className="canvasButtons"
            onClick={() => {
            props.saveDrawingData(props.saveableCanvas.clear());
            }}
        >
            <h6>Clear</h6>
        </button>
        <button
            className="canvasButtons"
            type="button"
            onClick={props.leaveRoom}
        >
            <h6>Leave Room</h6>
        </button>
    </div>
}

export default OptionBar