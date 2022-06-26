import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import { derivativeAtPoint, findVerticalAsymptote, isVerticalAsymptote, pointDistance } from './utils/Maths';

const App = () => {
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(window.innerHeight);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  var oneUnit = 50;

  var baseCenterX = width * 1;
  var baseCenterY = height * 1;

  var lastUpdatePosX = baseCenterX;
  var lastUpdatePosY = baseCenterY;
  var updateDist = width / 5;

  var dragging = false;
  var dragLastX = null;
  var dragLastY = null;

  var centerX = baseCenterX;
  var centerY = baseCenterY;

  var context = null;
  var canvas = null;

  const f = (x) => {
    // return ((x / 5) * (x + 1) * (x + 4)) / x;
    // return Math.log(x);
    // return Math.cos(x) / Math.sin(x);
    return (Math.sin(x) / x) * 5;
    // return Math.abs(1 / x);
    // return Math.tan(x);
  };

  const rerenderGraph = (x, y) => {
    context.globalCompositeOperation = 'copy';
    context.drawImage(context.canvas, x, y);
    context.globalCompositeOperation = 'source-over';
  };

  const renderGraph = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current.beginPath();

    const scale = oneUnit;
    const n = Math.floor(width / (2 * scale) + 6);
    const quality = 0.15;
    const h = 0.0000001;
    const delta = 0.00001;

    for (var x = -n / quality; x < n / quality; x++) {
      var offsetX = centerX - baseCenterX;
      var x_0 = Math.round(x - offsetX / (scale * quality)) * quality;
      var x_1 = Math.round(x - offsetX / (scale * quality) + 1) * quality;

      // check for asymptotes
      if (isVerticalAsymptote(f, h, x_0, x_1)) {
        var asymptote = findVerticalAsymptote(f, h, 30, x_0, x_1);

        if (!isFinite(f(x_0) && !isFinite(f(x_1)))) continue;
        if (
          Math.abs(f(asymptote - h) - f(asymptote + h)) < 0.2 &&
          Math.abs(derivativeAtPoint(f, asymptote - delta, h)) < 1 &&
          Math.abs(derivativeAtPoint(f, asymptote + delta, h)) < 1
        )
          continue;

        if (x_0 !== asymptote && x_1 !== asymptote) {
          var top = centerY - baseCenterY + height / 2;
          var bottom = centerY - baseCenterY - height / 2;

          if (derivativeAtPoint(f, x_0, h) > 0 && f(x_0) > f(x_1)) {
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - top - 250);

            contextRef.current.moveTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - bottom + 250);
          } else if (derivativeAtPoint(f, x_0, h) < 0 && f(x_0) < f(x_1)) {
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - bottom + 250);

            contextRef.current.moveTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - top - 250);
          }
        } else if (x_0 == asymptote) {
          if (derivativeAtPoint(f, x_1, h) > 0) {
            var bottom = centerY - baseCenterY - height / 2;

            contextRef.current.moveTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - bottom + 250);
          } else {
            var top = centerY - baseCenterY + height / 2;

            contextRef.current.moveTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - top - 250);
          }
        } else if (x_1 == asymptote) {
          if (derivativeAtPoint(f, x_0, h) > 0) {
            var top = centerY - baseCenterY + height / 2;

            contextRef.current.moveTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - top - 250);
          } else {
            var bottom = centerY - baseCenterY - height / 2;

            contextRef.current.moveTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
            contextRef.current.lineTo(centerX + asymptote * scale, centerY - bottom + 250);
          }
        }

        continue;
      }

      contextRef.current.moveTo(centerX + x_0 * scale, centerY - f(x_0) * scale);
      contextRef.current.lineTo(centerX + x_1 * scale, centerY - f(x_1) * scale);
      contextRef.current.stroke();
    }

    contextRef.current.closePath();
  };

  const setCanvas = () => {
    canvas = canvasRef.current;
    canvas.width = width * 2;
    canvas.height = height * 2;

    context = canvas.getContext('2d');
    // context.lineCap = 'round';
    context.strokeStyle = '#4da6ff';
    context.lineWidth = 1;
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
    canvasRef.current.onmousedown = () => {
      dragLastX = window.event.clientX;
      dragLastY = window.event.clientY;
      dragging = true;
    };

    document.body.onmouseup = () => {
      console.log('up');
      dragging = false;
    };

    canvasRef.current.onmouseover = () => {
      console.log('over');
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

      if (pointDistance(centerX, centerY, lastUpdatePosX, lastUpdatePosY) >= updateDist) {
        lastUpdatePosX = centerX;
        lastUpdatePosY = centerY;

        renderGraph();
      } else {
        rerenderGraph(x - dragLastX, y - dragLastY);
      }

      // rerenderGraph(x - dragLastX, y - dragLastY);

      dragLastX = x;
      dragLastY = y;
    };

    setCanvas();
    renderGraph();
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
