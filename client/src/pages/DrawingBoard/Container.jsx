import React from "react";
import Board from "./Board";

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "#000000",
      size: "5",
    };
  }

  changeColor(params) {
    this.setState({
      color: params.target.value,
    });
  }

  changeSize(params) {
    this.setState({
      size: params.target.value,
    });
  }

  render() {
    return (
      <div className="drawing-container">
        <div className="drawing-tools-section">
          <div className="drawing-color-picker-container">
            brush color &nbsp;
            <input
              type="color"
              value={this.state.color}
              onChange={this.changeColor.bind(this)}
            />
          </div>

          <div className="drawing-brushsize-container">
            brush size &nbsp;
            <select
              value={this.state.size}
              onChange={this.changeSize.bind(this)}
            >
              <option> 5 </option>
              <option> 10 </option>
              <option> 15 </option>
              <option> 20 </option>
              <option> 25 </option>
              <option> 30 </option>
            </select>
          </div>
        </div>

        <div className="drawing-board-container">
          <Board roomId={this.props?.roomId} color={this.state.color} size={this.state.size}></Board>
        </div>
      </div>
    );
  }
}

export default Container;
