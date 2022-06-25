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

  var oneUnit = 50;

  var baseCenterX = width / 2 + 2.5;
  var baseCenterY = height / 2 + 2.5;

  var dragging = false;
  var dragLastX = null;
  var dragLastY = null;

  var centerX = baseCenterX;
  var centerY = baseCenterY;

  var context = null;
  var canvas = null;

  const f = (x) => {
    return (Math.sin(x) / x) * 5;
  };

  const rerenderGraph = (x, y) => {
    context.globalCompositeOperation = 'copy';
    context.drawImage(context.canvas, x, y);
    context.globalCompositeOperation = 'source-over';
  };

  const renderGraph = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current.beginPath();

    const n = 15;
    const scale = oneUnit;
    var quality = 0.2;

    for (var x = -n / quality; x < n / quality; x++) {
      var offsetX = centerX - baseCenterX;
      var x_ = Math.round(x - offsetX / (scale * quality)) * quality;
      var x_1 = Math.round(x - offsetX / (scale * quality) + 1) * quality;

      if (isFinite(f(x_))) {
        contextRef.current.moveTo(centerX + x_ * scale, centerY - f(x_) * scale);
        contextRef.current.lineTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
        contextRef.current.stroke();
      }
    }

    contextRef.current.closePath();
  };

  const setCanvas = () => {
    canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = '#4da6ff';
    context.lineWidth = 3;
    contextRef.current = context;
  };

  const handleResize = () => {
    setWidth(window.innerWidth * 0.75);
    setHeight(window.innerHeight);

    baseCenterX = width / 2 + 2.5;
    baseCenterY = height / 2 + 2.5;

    setCanvas();
    renderGraph();
  };

  useEffect(() => {
    setCanvas();
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

      setDragOffsetX(centerX - baseCenterX);
      setDragOffsetY(centerY - baseCenterY);

      // rerenderGraph(x - dragLastX, y - dragLastY);
      renderGraph();

      dragLastX = x;
      dragLastY = y;
    };
  }, []);

  window.addEventListener('resize', handleResize);

  return (
    <div className='container'>
      <div className='left'></div>

      <div className='canvas-wrapper' id='canvas-wrapper'>
        <div
          className='grid'
          style={{
            'background-position': `${dragOffsetX + ((width / 2) % oneUnit)}px ${
              dragOffsetY + ((height / 2) % oneUnit)
            }px`,
          }}
        />
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
