import React, { useEffect, useRef, useState } from 'react';
import MathInput from './components/MathInput';
import './index.scss';
import { derivativeAtPoint, findVerticalAsymptote, isVerticalAsymptote, pointDistance } from '../utils/Maths';
import { evaluate } from 'mathjs';

const App = () => {
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(window.innerHeight);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  var oneUnit = 50;
  var gridSize = 50;

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

  const [centerX_state, setCenterX_state] = useState(centerX);
  const [centerY_state, setCenterY_state] = useState(centerY);

  var context = null;
  var canvas = null;

  var wrapWidth = Math.ceil(width / gridSize) * gridSize;
  var wrapHeight = Math.ceil(height / gridSize) * gridSize;
  var wrapsX = Math.abs(Math.floor((baseCenterX / 2 - dragOffsetX) / wrapWidth));
  var wrapsY = Math.abs(Math.floor((baseCenterY / 2 - dragOffsetY) / wrapHeight));
  var gapBetweenAxisNumbers = 1;

  var loops = 0;
  while ((wrapWidth / gridSize) % (gapBetweenAxisNumbers + 1) != 0) {
    wrapWidth += gridSize;

    if (++loops >= 100) break;
  }

  loops = 0;
  while ((wrapHeight / gridSize) % (gapBetweenAxisNumbers + 1) != 0) {
    wrapHeight += gridSize;

    if (++loops >= 100) break;
  }

  const expression = useRef('');

  const handleInputChange = (exp) => {
    expression.current = exp;
    renderGraph();
  };

  const f = (x) => {
    try {
      return evaluate(expression.current, { x: x });
    } catch (e) {
      // console.log('error: ', e);
    }
  };

  const rerenderGraph = (x, y) => {
    context.globalCompositeOperation = 'copy';
    context.drawImage(context.canvas, x, y);
    context.globalCompositeOperation = 'source-over';
  };

  const renderGraph = (cx = centerX_state, cy = centerY_state) => {
    // var cx = centerX_state;
    // var cy = centerY_state;

    canvas = canvasRef.current;
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current.beginPath();

    const scale = oneUnit;
    const n = Math.floor(width / (2 * scale) + 6);
    const quality = 0.075;
    const h = 0.0000001;
    const delta = 0.00001;

    for (var x = -n / quality; x < n / quality; x++) {
      var offsetX = cx - baseCenterX;
      var x_0 = Math.round(x - offsetX / (scale * quality)) * quality;
      var x_1 = Math.round(x - offsetX / (scale * quality) + 1) * quality;

      // check for asymptotes
      if (isVerticalAsymptote(f, h, x_0, x_1)) {
        var asymptote = findVerticalAsymptote(f, h, 30, x_0, x_1);

        if (!isFinite(f(x_0) && !isFinite(f(x_1)))) continue;
        if (
          Math.abs(f(asymptote - h) - f(asymptote + h)) < 0.2 &&
          Math.abs(derivativeAtPoint(f, asymptote - delta, h)) < 2 &&
          Math.abs(derivativeAtPoint(f, asymptote + delta, h)) < 2
        )
          continue;

        if (x_0 !== asymptote && x_1 !== asymptote) {
          var top = cy - baseCenterY + height / 2;
          var bottom = cy - baseCenterY - height / 2;

          if (derivativeAtPoint(f, x_0, h) > 0 && f(x_0) > f(x_1)) {
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);

            contextRef.current.moveTo(cx + x_1 * scale, cy - f(x_1) * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          } else if (derivativeAtPoint(f, x_0, h) < 0 && f(x_0) < f(x_1)) {
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);

            contextRef.current.moveTo(cx + x_1 * scale, cy - f(x_1) * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          }
        } else if (x_0 == asymptote) {
          if (derivativeAtPoint(f, x_1, h) > 0) {
            var bottom = cy - baseCenterY - height / 2;

            contextRef.current.moveTo(cx + x_1 * scale, cy - f(x_1) * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          } else {
            var top = cy - baseCenterY + height / 2;

            contextRef.current.moveTo(cx + x_1 * scale, cy - f(x_1) * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          }
        } else if (x_1 == asymptote) {
          if (derivativeAtPoint(f, x_0, h) > 0) {
            var top = cy - baseCenterY + height / 2;

            contextRef.current.moveTo(cx + x_1 * scale, cy - f(x_1) * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          } else {
            var bottom = cy - baseCenterY - height / 2;

            contextRef.current.moveTo(cx + x_1 * scale, cy - f(x_1) * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          }
        }

        continue;
      }

      contextRef.current.moveTo(cx + x_0 * scale, cy - f(x_0) * scale);
      contextRef.current.lineTo(cx + x_1 * scale, cy - f(x_1) * scale);
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

  // const createAxisNumbers = () => {
  //   var wrapper = document.getElementById('canvas-wrapper');
  //   var numbers = Math.ceil(width / oneUnit);

  //   for (var i = 0; i < numbers; i++) {
  //     var left = width * 0.25 + ((centerX - baseCenterX + ((width / 2) % oneUnit)) % oneUnit) + i * oneUnit + 100 - 18;
  //     var top = height / 2 + 18;
  //     if (i == Math.floor(numbers / 2)) continue;

  //     var element = document.createElement('p');
  //     element.innerText = i;
  //     element.classList.add('axis-number');
  //     element.id = i;
  //     element.style.left = `${left}px`;
  //     element.style.top = `${top}px`;

  //     wrapper.appendChild(element);
  //     axisNumbersElements.push(element);
  //   }
  // };

  useEffect(() => {
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

      setCenterX_state(centerX);
      setCenterY_state(centerY);

      if (pointDistance(centerX, centerY, lastUpdatePosX, lastUpdatePosY) >= updateDist) {
        lastUpdatePosX = centerX;
        lastUpdatePosY = centerY;

        renderGraph(centerX, centerY);
      } else {
        rerenderGraph(x - dragLastX, y - dragLastY);
      }

      dragLastX = x;
      dragLastY = y;
    };

    setCanvas();
    renderGraph();
  }, []);

  // useEffect(() => {
  //   renderGraph();
  // }, [forceUpdate]);

  window.addEventListener('resize', handleResize);

  return (
    <div className='container'>
      <div className='left'>
        <MathInput callback={handleInputChange} />
      </div>

      <div className='canvas-wrapper' id='canvas-wrapper'>
        <div
          className='grid'
          style={{
            backgroundPosition: `${dragOffsetX + ((width / 2) % gridSize)}px ${
              dragOffsetY + ((height / 2) % gridSize)
            }px`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
        <canvas id='canvas' width={width} height={height} ref={canvasRef}></canvas>
        <div className='y-axis' style={{ left: `${62.5 + (dragOffsetX * 100) / window.innerWidth}vw` }} />
        <div className='x-axis' style={{ top: `${50 + (dragOffsetY * 100) / window.innerHeight}vh` }} />
        <p className='y-axis-label' style={{ left: `calc(${62.5 + (dragOffsetX * 100) / window.innerWidth}vw + 10px)` }}>
          Y
        </p>
        <p className='x-axis-label' style={{ top: `calc(${50 + (dragOffsetY * 100) / window.innerHeight}vh + 19px)` }}>
          X
        </p>
        <p
          className='axis-number'
          style={{
            right: `calc(${37.5 - (dragOffsetX * 100) / window.innerWidth}vw + 7px)`,
            top: `calc(${50 + (dragOffsetY * 100) / window.innerHeight}vh + 14px)`,
          }}
        >
          0
        </p>
        {/* X axis numbers */}
        {[...Array(Math.ceil(width / gridSize / (gapBetweenAxisNumbers + 1))).keys()].map((i) => {
          var offset = i * gridSize * (gapBetweenAxisNumbers + 1);
          var axisNumberPosX = (baseCenterX / 2 + dragOffsetX + wrapWidth * wrapsX + offset) % wrapWidth;
          var value = Math.floor((axisNumberPosX - centerX / 2) / gridSize - Math.floor(dragOffsetX / gridSize));

          if (value === 0) return;

          return (
            <p
              key={i}
              className='axis-number x-axis-number'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / window.innerHeight}vh + 14px)`,
                left: `calc(25vw + ${axisNumberPosX}px)`,
              }}
            >
              {value}
            </p>
          );
        })}

        {/* Y axis numbers */}
        {[...Array(Math.ceil(height / gridSize / (gapBetweenAxisNumbers + 1))).keys()].map((i) => {
          var offset = i * gridSize * (gapBetweenAxisNumbers + 1);
          var axisNumberPosY = (baseCenterY / 2 + dragOffsetY + wrapHeight * wrapsY + offset) % wrapHeight;
          var value = -Math.floor((axisNumberPosY - centerY / 2) / gridSize - Math.floor(dragOffsetY / gridSize));

          if (value === 0) return;

          return (
            <p
              key={i}
              className='axis-number'
              style={{
                // top: `calc(${50 + (dragOffsetY * 100) / window.innerHeight}vh + 18px)`,
                // left: `calc(25vw + ${axisNumberPosY}px)`,
                right: `calc(${37.5 - (dragOffsetX * 100) / window.innerWidth}vw + 7px)`,
                top: `${axisNumberPosY}px`,
              }}
            >
              {value}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default App;
