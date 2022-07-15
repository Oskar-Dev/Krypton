import React, { useEffect, useRef, useState } from 'react';
import MathInput from './components/MathInput';
import './index.scss';
import { pointDistance } from '../utils/Maths';
import evaluatex from 'evaluatex';
import renderGraph from './graphFunctions/renderGraph';
import evaluatePoints from './graphFunctions/evalutePoints';
import AddButton from './components/AddButton';
import { graphColors } from '../utils/graphColors';
import { defaultGraphSettings, toGraph } from '../utils/toGraph';

const App = () => {
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(window.innerHeight);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [rerenderCounter, setRerenderCounter] = useState(0);

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

  var centerX = useRef(baseCenterX);
  var centerY = useRef(baseCenterY);

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

  const addNewMathInput = () => {
    toGraph.push({
      func: null,
      settings: {
        opacity: defaultGraphSettings.opacity,
        width: defaultGraphSettings.width,
        color: graphColors[(rerenderCounter + 1) % graphColors.length],
      },
    });

    setRerenderCounter(rerenderCounter + 1);
  };

  const deleteMathInput = (index) => {
    if (toGraph.length === 1) toGraph[0] = { func: null, latex: '', settings: { ...defaultGraphSettings } };
    else toGraph.splice(index, 1);

    setRerenderCounter(rerenderCounter + 1);
    renderGraphs();
  };

  const handleInputChange = (exp, index) => {
    try {
      var fn = evaluatex(exp, {}, { latex: true });

      toGraph[index].func = fn;
    } catch (e) {
      console.log(e);
      toGraph[index].func = null;
    }

    toGraph[index].latex = exp;

    renderGraphs();
  };

  const rerenderGraph = (x, y) => {
    context.globalCompositeOperation = 'copy';
    context.drawImage(context.canvas, x, y);
    context.globalCompositeOperation = 'source-over';
  };

  const updatePoints = (index) => {
    var data = toGraph[index];
    var { func } = data;

    if (func === null) {
      data.points = [];
      return;
    }

    var delta = 0.09;
    var n = Math.floor(width / (2 * oneUnit) + 5);
    var offsetX = Math.ceil((baseCenterX - centerX.current) / gridSize);
    var from = -n + offsetX - 1;
    var to = n + offsetX + 1;

    data.points = evaluatePoints(func, from, to, delta);
  };

  const renderGraphs = () => {
    setCanvas();
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < toGraph.length; i++) {
      try {
        if (toGraph[i] === undefined) continue;
        updatePoints(i);

        var { points } = toGraph[i];
        var { color } = toGraph[i].settings;

        context.strokeStyle = color;
        renderGraph(contextRef.current, centerX.current, centerY.current, points, oneUnit);
      } catch (e) {
        console.log('RENDERING ERROR', toGraph[i], e);
      }
    }
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
    // setWidth(window.innerWidth * 0.75);
    // setHeight(window.innerHeight);
    // baseCenterX = width / 2 + 2.5;
    // baseCenterY = height / 2 + 2.5;
    // setCanvas();
    // renderGraph();
  };

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

      centerX.current += x - dragLastX;
      centerY.current += y - dragLastY;

      setDragOffsetX(centerX.current - baseCenterX);
      setDragOffsetY(centerY.current - baseCenterY);

      if (pointDistance(centerX.current, centerY.current, lastUpdatePosX, lastUpdatePosY) >= updateDist) {
        lastUpdatePosX = centerX.current;
        lastUpdatePosY = centerY.current;

        renderGraphs();
      } else {
        rerenderGraph(x - dragLastX, y - dragLastY);
      }

      dragLastX = x;
      dragLastY = y;
    };

    renderGraphs();
  }, []);

  window.addEventListener('resize', handleResize);

  return (
    <div className='container'>
      <div className='left'>
        {toGraph.map((obj, index) => {
          return (
            <MathInput
              callback={handleInputChange}
              deleteCallback={deleteMathInput}
              index={index}
              key={index}
              expression={obj.latex}
              rerenderCounter={rerenderCounter}
            />
          );
        })}
        <AddButton callback={addNewMathInput} />
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
          var value = Math.floor((axisNumberPosX - baseCenterX / 2) / gridSize - Math.floor(dragOffsetX / gridSize));

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
          var value = -Math.floor((axisNumberPosY - baseCenterY / 2) / gridSize - Math.floor(dragOffsetY / gridSize));

          // console.log(centerY.current);

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
