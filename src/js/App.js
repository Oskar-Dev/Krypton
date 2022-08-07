import React, { useEffect, useRef, useState } from 'react';
import MathInput from './components/MathInput';
import './index.scss';
import { pointDistance } from '../utils/Maths';
import renderGraph from './graphFunctions/renderGraph';
import evaluatePoints from './graphFunctions/evalutePoints';
import AddButton from './components/AddButton';
import { graphColors } from '../utils/graphColors';
import { defaultGraphSettings, lineDashStyles, toGraph } from '../utils/toGraph';
import { parseLatex } from '../utils/parseLatex';
import { MATHJS } from '../utils/MATHJS.js';
import renderPoints from './graphFunctions/renderPoints';

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
      renderSinglePoints: false,
      settings: {
        color: graphColors[(rerenderCounter + 1) % graphColors.length],
        opacity: defaultGraphSettings.opacity,
        width: defaultGraphSettings.width,
        lineDash: defaultGraphSettings.lineDash,
        boundaries: { ...defaultGraphSettings.boundaries },
        pointStyle: defaultGraphSettings.pointStyle,
      },
    });

    setRerenderCounter(rerenderCounter + 1);
  };

  const deleteMathInput = (index) => {
    if (toGraph.length === 1)
      toGraph[0] = {
        func: null,
        renderSinglePoints: false,
        latex: '',
        settings: { ...defaultGraphSettings, boundaries: { ...defaultGraphSettings.boundaries } },
      };
    else toGraph.splice(index, 1);

    setRerenderCounter(rerenderCounter + 1);
    renderGraphs();
  };

  const handleInputChange = (exp, index) => {
    var points = exp.match(/\\left\(.+?,.+?\\right\),|\\left\(.+?,.+?\\right\)$/g);
    if (points !== undefined && points !== null) {
      toGraph[index].renderSinglePoints = true;
      toGraph[index].points = [];

      points.forEach((pointLatex) => {
        pointLatex = pointLatex.replace(pointLatex.match(/^\\left\(/g), '');
        pointLatex = pointLatex.replace(pointLatex.match(/\\right\),/g), '');
        pointLatex = pointLatex.replace(pointLatex.match(/\\right\)$/g), '');
        console.log('pl', pointLatex);
        var [pointXLatex, pointYLatex] = pointLatex.split(',');

        var parsedPointXLatex = parseLatex(pointXLatex);
        var parsedPointYLatex = parseLatex(pointYLatex);

        try {
          var x = MATHJS.evaluate(parsedPointXLatex);
          var y = MATHJS.evaluate(parsedPointYLatex);

          toGraph[index].points.push({ x: x, y: y });
        } catch (e) {
          console.log("couldn't evaluate point values", e);
        }
      });
    } else {
      toGraph[index].renderSinglePoints = false;
      var parsedExpression = parseLatex(exp);
      console.log('before:', exp);
      console.log('after:', parsedExpression);

      try {
        var fn = MATHJS.compile(parsedExpression);

        toGraph[index].func = fn;
      } catch (e) {
        console.log("couldn't compile function", e);
        toGraph[index].func = null;
      }
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
    var { func, settings } = data;
    var { boundaries } = settings;

    if (func === null) {
      data.points = [];
      return;
    }

    var delta = 0.025;
    var n = Math.floor(width / (2 * oneUnit) + 5);
    var offsetX = Math.ceil((baseCenterX - centerX.current) / gridSize);
    var from = -n + offsetX - 1;
    var to = n + offsetX + 1;

    if (boundaries.left !== null) from = Math.max(boundaries.left, from);

    if (boundaries.right !== null) to = Math.min(boundaries.right, to);

    data.points = evaluatePoints(func, from, to, delta);
  };

  const renderGraphs = () => {
    setCanvas();
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < toGraph.length; i++) {
      try {
        if (toGraph[i] === undefined) continue;
        var { renderSinglePoints, settings } = toGraph[i];
        var { color, opacity, width, lineDash, pointStyle } = settings;
        var lineDashStyle;

        // opacity
        var opacity_ = Math.floor(parseFloat(opacity) * 255);
        if (isNaN(opacity_) || opacity_ === undefined || opacity_ === null || opacity_ > 255 || opacity_ < 0)
          opacity_ = 255;

        var opacityHex = opacity_.toString(16);
        if (opacityHex.length === 1) opacityHex = '0' + opacityHex;

        // color & width
        context.strokeStyle = color + opacityHex;
        context.lineWidth = width === '' ? 1 : width;

        if (renderSinglePoints) {
          var { points } = toGraph[i];

          // set linedash style to the default one to avoid weird looking points
          context.setLineDash(lineDashStyles[0]);

          renderPoints(contextRef.current, centerX.current, centerY.current, points, oneUnit, width, pointStyle);
        } else {
          updatePoints(i);
          var { points } = toGraph[i];

          // line dash
          if (lineDash === 0) lineDashStyle = lineDashStyles[0];
          else if (lineDash === 1)
            lineDashStyle = [lineDashStyles[lineDash][0] * width * 0.25, lineDashStyles[lineDash][1] * width * 0.225];
          else lineDashStyle = [lineDashStyles[lineDash][0], lineDashStyles[lineDash][1] * width * 0.25];

          context.setLineDash(lineDashStyle);

          // render
          renderGraph(contextRef.current, centerX.current, centerY.current, points, oneUnit);
        }
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
    contextRef.current = context;
    context.lineCap = 'round';
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
              renderGraphs={renderGraphs}
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
