import { CLIENT_ROOT_URL } from "../../constants/api";
// receives canvas id for the provided user object and optional audiostream to be animated
export const visualize = (canvasId, audioStream = null) => {
  const _visualizer = new Visualizer(
    {
      loop: true,
      canvas: "canvas-" + canvasId,
      style: "lounge",
      barWidth: 0.5,
      barHeight: 0.3,
      barSpacing: 2,
      barColor: "blue",
      shadowBlur: 20,
      shadowColor: "#ffffff",
      font: ["12px", "Helvetica"],
    },
    audioStream
  );

  _visualizer.getInstance();
};

class Visualizer {
  constructor(cfg, stream) {
    this.FFT_SIZE = 512;
    this.TYPE = {
      lounge: "renderLounge",
    };

    this.isPlaying = false;
    this.loop = cfg.loop || false;
    this.loopEnd = 1.2;
    this.canvas = document.getElementById(cfg.canvas) || {};
    this.canvasCtx = this.canvas.getContext
      ? this.canvas.getContext("2d") || null
      : null;
    this.ctx = null;
    this.analyser = null;
    this.frequencyData = [];
    this.style = cfg.style || "lounge";
    this.barWidth = cfg.barWidth || 1;
    this.barHeight = cfg.barHeight || 2;
    this.barSpacing = cfg.barSpacing || 5;
    this.barColor = cfg.barColor || "#ffffff";
    this.shadowBlur = cfg.shadowBlur || 10;
    this.shadowColor = cfg.shadowColor || "#ffffff";
    this.font = cfg.font || ["12px", "Helvetica"];
    this.gradient = null;
    this.audioStream = stream;
  }

  setContext() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new window.AudioContext();

      return this;
    } catch (e) {
      console.info("Web Audio API is not supported.", e);
    }
  }

  /**
   * @description
   * Set buffer analyser.
   *
   * @return {Object}
   */
  setAnalyser() {
    this.analyser = this.ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = this.FFT_SIZE;
    return this;
  }

  /**
   * @description
   * Set frequency data.
   *
   * @return {Object}
   */
  setFrequencyData() {
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    return this;
  }

  /**
   * @description
   * Set canvas gradient color.
   *
   * @return {Object}
   */
  setCanvasStyles() {
    this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
    this.gradient.addColorStop(1, this.barColor);
    this.canvasCtx.fillStyle = this.gradient;
    this.canvasCtx.shadowBlur = this.shadowBlur;
    this.canvasCtx.shadowColor = this.shadowColor;
    this.canvasCtx.font = this.font.join(" ");
    this.canvasCtx.textAlign = "center";
    return this;
  }

  /**
   * @description
   * Bind click events.
   *
   * @return {Object}
   */
  bindEvents() {
    this.userMic();
    return this;
  }

  /**
   * @description
   * On audio data stream error fn.
   *
   * @param  {Object} e
   */
  onError(e) {
    console.info("Error decoding audio file. -- ", e);
  }

  /**
   * @description
   * Render frame on canvas.
   */
  renderFrame() {
    requestAnimationFrame(this.renderFrame.bind(this));
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderByStyleType();
  }

  /**
   * @description
   * Render frame by style type.
   *
   * @return {Function}
   */
  renderByStyleType() {
    return this[this.TYPE[this.style]]();
  }

  /**
   * @description
   * Render lounge style type.
   */
  renderLounge() {
    var cx = this.canvas.width / 2;
    var cy = this.canvas.height / 2;
    var radius = 28;
    var maxBarNum = Math.floor(
      (radius * 2 * Math.PI) / (this.barWidth + this.barSpacing)
    );
    var slicedPercent = Math.floor((maxBarNum * 25) / 100);
    var barNum = maxBarNum - slicedPercent;
    var freqJump = Math.floor(this.frequencyData.length / maxBarNum);

    for (var i = 0; i < barNum; i++) {
      var amplitude = this.frequencyData[i * freqJump];
      var alfa = (i * 2 * Math.PI) / maxBarNum;
      var beta = ((3 * 45 - this.barWidth) * Math.PI) / 180;
      var x = 0;
      var y = radius - (amplitude / 12 - this.barHeight);
      var w = this.barWidth;
      var h = amplitude / 9 + this.barHeight;

      this.canvasCtx.save();
      this.canvasCtx.translate(cx + this.barSpacing, cy + this.barSpacing);
      this.canvasCtx.rotate(alfa - beta);
      this.canvasCtx.fillRect(x, y, w, h);
      this.canvasCtx.restore();
    }
  }

  /**
   * @description
   * Initialize renderring loop.
   */
  initRenderLoop() {
    this.setFrequencyData();
    this.renderFrame();
  }

  /**
   * @description
   * Processing mic audio stream.
   */

  processStream(stream) {
    const source = this.ctx.createMediaStreamSource(stream);
    this.setAnalyser();

    // add processor node
    console.log("stream: ", stream);
    this.ctx.audioWorklet
      .addModule(`${CLIENT_ROOT_URL}/js/worklet-processor.mjs`)
      .then(() => {
        let node = new AudioWorkletNode(this.ctx, "my-worklet-processor");
        source.connect(this.analyser);
        source.connect(node).connect(this.ctx.destination);

        this.initRenderLoop();
      })
      .catch(this.onError);
  }

  /**
   * @description
   * access user microphone.
   */
  userMic() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        this.processStream(stream);
      })
      .catch(this.onError);
  }

  /**
   * @description
   * Create visualizer object instance.
   *
   * @param  {Object} cfg
   * {
   *     autoplay: <Bool>,
   *     loop: <Bool>,
   *     canvas: <String>,
   *     style: <String>,
   *     barWidth: <Integer>,
   *     barHeight: <Integer>,
   *     barSpacing: <Integer>,
   *     barColor: <String>,
   *     shadowBlur: <Integer>,
   *     shadowColor: <String>,
   *     font: <Array>
   * }
   * @return {Function}
   * @private
   */
  _createVisualizer() {
    this.setContext().setAnalyser().setCanvasStyles();
    // .bindEvents();

    console.log("samp: ", this.audioStream);
    this.processStream(this.audioStream);
  }

  /**
   * @description
   * Get visualizer instance.
   *\
   * @param  {Object} cfg
   * @return {Object}
   * @public
   */
  getInstance() {
    if (this.canvas && this.canvasCtx) return this._createVisualizer();
  }
}
