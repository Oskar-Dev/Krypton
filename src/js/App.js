import React, { useEffect, useRef, useState } from 'react';
import MathInput from './components/MathInput';
import './index.scss';
import {
  derivativeAtPoint,
  evaluateFunction,
  findVerticalAsymptote,
  isVerticalAsymptote,
  pointDistance,
} from '../utils/Maths';
import { evaluate } from 'mathjs';
import evaluatex from 'evaluatex';
// import { MathJax, MathJaxContext } from 'better-react-mathjax'; do wywalenia
// import { InlineMath, BlockMath } from 'react-katex'; do wywalenia
//  do wywalenia

const App = () => {
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(window.innerHeight);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  var fn = null;

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

  const handleInputChange = (exp) => {
    try {
      fn = evaluatex(exp, {}, { latex: true });
    } catch (e) {
      console.log(e);
      fn = null;
    }

    renderGraph();
  };

  const f = (x) => {
    try {
      // return evaluate(expression.current, { x: x });
      return fn({ x: x });
    } catch (e) {
      // console.log('error: ', e);
    }
  };

  // console.log(evaluate('log(x)', { x: -10 }));

  const rerenderGraph = (x, y) => {
    context.globalCompositeOperation = 'copy';
    context.drawImage(context.canvas, x, y);
    context.globalCompositeOperation = 'source-over';
  };

  const renderGraph = (cx = centerX_state, cy = centerY_state) => {
    canvas = canvasRef.current;
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current.beginPath();

    const scale = oneUnit;
    const n = Math.floor(width / (2 * scale) + 5);
    const quality = 0.085;
    // const quality = 0.002;
    const h = 0.0000001;
    const delta = 0.0005;
    const asymptoteQuality = 25;

    var offsetX = Math.ceil((baseCenterX - cx) / gridSize);

    var functionData = evaluateFunction(f, -n + offsetX, n + offsetX, quality);

    for (var i = 0; i < functionData.length - 1; i++) {
      var data_0 = functionData[i];
      var data_1 = functionData[i + 1];

      var x_0 = data_0.argument;
      var x_1 = data_1.argument;

      var value_0 = data_0.value;
      var value_1 = data_1.value;

      if (isNaN(parseFloat(value_0)) && isNaN(parseFloat(value_1))) continue;

      var derivativeAtX_0 = derivativeAtPoint(f, x_0, h);
      var derivativeAtX_1 = derivativeAtPoint(f, x_1, h);

      // check for asymptotes
      if (isVerticalAsymptote(derivativeAtX_0, derivativeAtX_1, value_0, value_1)) {
        var asymptoteData = findVerticalAsymptote(f, h, asymptoteQuality, x_0, x_1);
        if (asymptoteData.asymptote == false) continue;

        var asymptote = asymptoteData.value;
        if (!isFinite(value_0) && !isFinite(value_1)) continue;
        if (
          Math.abs(f(asymptote - delta) - f(asymptote + delta)) < 0.2 &&
          Math.abs(derivativeAtPoint(f, asymptote - delta, h)) < 2 &&
          Math.abs(derivativeAtPoint(f, asymptote + delta, h)) < 2
        )
          continue;

        var top = cy - baseCenterY + height / 2;
        var bottom = cy - baseCenterY - height / 2;

        if (value_0 == undefined && value_1 !== undefined) {
          if (derivativeAtX_1 > 0) {
            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          } else {
            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          }

          contextRef.current.stroke();
          continue;
        } else if (value_0 != undefined && value_1 == undefined) {
          if (derivativeAtX_0 > 0) {
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          } else {
            contextRef.current.moveTo(cx + x_0 * scale, cy - value_0 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          }

          context.lineWidth++;
          contextRef.current.stroke();
          context.lineWidth--;
          continue;
        }

        if (Math.sign(derivativeAtX_0) == -1 && Math.sign(derivativeAtX_1) == 1) {
          contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);

          contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
          contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);

          contextRef.current.stroke();
          continue;
        } else if (Math.sign(derivativeAtX_0) == 1 && Math.sign(derivativeAtX_1) == -1) {
          contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);

          contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
          contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);

          contextRef.current.stroke();
          continue;
        }

        if (x_0 !== asymptote && x_1 !== asymptote) {
          if (derivativeAtX_0 > 0 && value_0 > value_1) {
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);

            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          } else if (derivativeAtX_0 < 0 && value_0 < value_1) {
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);

            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          }

          contextRef.current.stroke();
        } else if (x_0 == asymptote) {
          if (derivativeAtX_1 > 0) {
            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          } else if (derivativeAtX_1 < 0) {
            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          }
        } else if (x_1 == asymptote) {
          if (derivativeAtX_0 > 0) {
            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - top - 250);
          } else if (derivativeAtX_1 < 0) {
            contextRef.current.moveTo(cx + x_1 * scale, cy - value_1 * scale);
            contextRef.current.lineTo(cx + asymptote * scale, cy - bottom + 250);
          }

          contextRef.current.stroke();
        }

        continue;
      }

      contextRef.current.moveTo(cx + x_0 * scale, cy - value_0 * scale);
      contextRef.current.lineTo(cx + x_1 * scale, cy - value_1 * scale);
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
