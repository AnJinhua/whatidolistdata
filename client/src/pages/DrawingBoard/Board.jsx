import React from "react";
import io from "socket.io-client";
import { API_URL } from "../../constants/api";

class Board extends React.Component {
  timeout;
  ctx;
  isDrawing = false;

  constructor(props) {
    super(props);
    this.socket = io.connect(API_URL);
    this.roomId = this.props.roomId
    this.socket.on("canvas-cleared", (data) => {
      if (data?.id === this.props?.roomId) {
        let canvas = document.querySelector("#board");
        this.ctx = canvas.getContext("2d");
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    })
    this.socket.on("canvas-data", (data) => {
      if (data?.id === this.props?.roomId) {
        let root = this;
        let interval = setInterval(function () {
          if (root.isDrawing) return;
          root.isDrawing = true;
          clearInterval(interval);
          let image = new Image();
          let canvas = document.querySelector("#board");
          let ctx = canvas.getContext("2d");
          image.onload = function () {
            ctx.drawImage(image, 0, 0);
            root.isDrawing = false;
          };
          image.src = data?.imageData;
        }, 200);
      }
    });
  }

  handleCLearCanvas(roomId) {
    let canvas = document.querySelector("#board");
    this.ctx = canvas.getContext("2d");
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.socket.emit("canvas-cleared", {
      roomId: roomId
    });
  };

  componentDidMount() {
    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps) {
    this.ctx.strokeStyle = newProps.color;
    this.ctx.lineWidth = newProps.size;
  }

  drawOnCanvas() {
    let canvas = document.querySelector("#board");
    this.ctx = canvas.getContext("2d");
    let ctx = this.ctx;

    let sketch = document.querySelector("#sketch");
    let sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    let mouse = { x: 0, y: 0 };
    let last_mouse = { x: 0, y: 0 };

    canvas.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = this.props.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = this.props.color;

    canvas.addEventListener(
      "mousedown",
      function (e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    let root = this;
    let onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      if (root.timeout !== undefined) clearTimeout(root.timeout);
      root.timeout = setTimeout(function () {
        let base64ImageData = canvas.toDataURL("image/png");
        root.socket.emit("canvas-data", {
          base64Image: base64ImageData,
          roomId: root.roomId
        });
      }, 1000);
    };
  }

  render() {
    return (
      <div class="drawing-sketch" id="sketch">
        <button onClick={() => this.handleCLearCanvas(this.roomId)}> CLear </button>
        <canvas className="drawing-board" id="board"></canvas>
      </div>
    );
  }
}

export default Board;
