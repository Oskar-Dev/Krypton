import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
// import './index.scss';

const App = () => {
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(window.innerHeight);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const BASE_CENTER_X = width / 2 + 2.5;
  const BASE_CENTER_Y = height / 2 + 2.5;

  var dragging = false;
  var dragLastX = null;
  var dragLastY = null;

  var centerX = BASE_CENTER_X;
  var centerY = BASE_CENTER_Y;

  const f = (x) => {
    // return (Math.sin(x) / x) * 5;
    // return x ** 2;
    return (Math.cos(x) / x) * 3;
    // return (x + 2) ** 2 / (x + 2);
  };

  const renderGraph = () => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = '#4da6ff';
    context.lineWidth = 3;
    contextRef.current = context;

    contextRef.current.beginPath();

    const n = 20;
    const scale = 50;
    const quality = 0.25;

    for (var x = -n / quality; x < n / quality; x++) {
      var x_ = x * quality;
      var x_1 = (x + 1) * quality;

      if (isFinite(f(x_))) {
        contextRef.current.moveTo(centerX + x_ * scale, centerY - f(x_) * scale);
        contextRef.current.lineTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
        contextRef.current.stroke();
      }
    }

    contextRef.current.closePath();
  };

  const handleInput = (val) => {
    console.log(val);
  };

  const handleResize = () => {
    setWidth(window.innerWidth * 0.75);
    setHeight(window.innerHeight);

    renderGraph();
  };

  useEffect(() => {
    renderGraph();

    canvasRef.current.onmousedown = () => {
      dragLastX = window.event.clientX;
      dragLastY = window.event.clientY;
      dragging = true;
    };

    canvasRef.current.onmouseup = () => {
      dragging = false;
    };

    canvasRef.current.onmousemove = () => {
      if (!dragging) return;

      var x = window.event.clientX;
      var y = window.event.clientY;

      centerX += x - dragLastX;
      centerY += y - dragLastY;

      dragLastX = x;
      dragLastY = y;

      setDragOffsetX(centerX - BASE_CENTER_X);
      setDragOffsetY(centerY - BASE_CENTER_Y);
      renderGraph();
    };
  }, []);

  return (
    <div className='container'>
      <div className='left'></div>

      <div className='canvas-wrapper' id='canvas-wrapper'>
        <div className='grid' style={{ 'background-position': `${20 + dragOffsetX}px ${dragOffsetY - 4}px` }} />
        <canvas id='canvas' width={width} height={height} ref={canvasRef}></canvas>
        {/* <div className='y-axis' /> */}
        {/* <div className='x-axis' /> */}
        <div className='y-axis' style={{ left: `${62.5 + (dragOffsetX * 100) / window.innerWidth}vw` }} />
        <div className='x-axis' style={{ top: `${50 + (dragOffsetY * 100) / window.innerHeight}vh` }} />
        <p className='y-axis-label' style={{ left: `calc(${62.5 + (dragOffsetX * 100) / window.innerWidth}vw + 10px)` }}>
          Y
        </p>
        <p className='x-axis-label' style={{ top: `calc(${50 + (dragOffsetY * 100) / window.innerHeight}vh + 19px)` }}>
          X
        </p>
      </div>
    </div>
  );
};

export default App;
