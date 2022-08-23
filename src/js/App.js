import React, { useEffect, useRef, useState } from 'react';
import MathInput from './components/MathInput';
import { pointDistance } from '../utils/Maths';
import renderGraph from './graphFunctions/renderGraph';
import evaluatePoints from './graphFunctions/evalutePoints';
import AddButton from './components/AddButton';
import { graphColors } from '../utils/graphColors';
import { defaultGraphSettings, lineDashStyles, toGraph } from '../utils/toGraph';
import { parseLatex } from '../utils/parseLatex';
import { MATHJS } from '../utils/MATHJS.js';
import renderPoints from './graphFunctions/renderPoints';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Titlebar from './components/Titlebar';
import SettingsModal from './components/SettingsModal';
import { defaultSettings, settings } from '../utils/globalSettings';
import { themes } from '../utils/themes';

import '../styles/globals.css';
import '../styles/App.css';

const TITLE_BAR_HEIGHT = 32;

const getWindowHeight = () => {
  return window.innerHeight;
};

const App = () => {
  const [settingOpened, setSettingOpened] = useState(false);

  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [height, setHeight] = useState(getWindowHeight());
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [rerenderCounter, setRerenderCounter] = useState(0);

  var oneUnit = 50;
  var gridWith = parseFloat(settings.grid.width.toString().replace(',', '.')) * oneUnit;
  var gridHeight = parseFloat(settings.grid.height.toString().replace(',', '.')) * oneUnit;

  if (isNaN(gridWith)) gridWith = defaultSettings.grid.width * oneUnit;
  if (isNaN(gridHeight)) gridHeight = defaultSettings.grid.height * oneUnit;

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

  // var wrapWidth = Math.floor(width / gridSize) * gridSize + gridSize;
  // var wrapHeight = Math.floor(height / gridSize) * gridSize + gridSize;
  // var wrapsX = Math.abs(Math.floor((baseCenterX / 2 - dragOffsetX) / wrapWidth));
  // var wrapsY = Math.abs(Math.floor((baseCenterY / 2 - dragOffsetY) / wrapHeight));
  var numbersDistanceX = parseFloat(settings.axisX.numbersDistance.toString().replace(',', '.').replace('pi', Math.PI));
  var numbersDistanceY = parseFloat(settings.axisY.numbersDistance.toString().replace(',', '.').replace('pi', Math.PI));
  // console.log(numbersDistanceX);
  var gapBetweenAxisXNumbers =
    !isNaN(numbersDistanceX) && numbersDistanceX > 0 ? numbersDistanceX : defaultSettings.axisX.numbersDistance;
  var gapBetweenAxisYNumbers =
    !isNaN(numbersDistanceY) && numbersDistanceY > 0 ? numbersDistanceY : defaultSettings.axisY.numbersDistance;
  // var AxisXPi = settings.axisX.numbersDistance.toString().includes('pi');

  // var loops = 0;
  // while ((wrapWidth / gridSize) % gapBetweenAxisXNumbers != 0) {
  //   wrapWidth += gridSize;

  //   if (++loops >= 100) break;
  // }

  // loops = 0;
  // while ((wrapHeight / gridSize) % gapBetweenAxisYNumbers != 0) {
  //   wrapHeight += gridSize;

  //   if (++loops >= 100) break;
  // }

  const addNewMathInput = () => {
    toGraph.push({
      id: rerenderCounter + 1,
      func: null,
      renderSinglePoints: false,
      settings: {
        color: graphColors[(rerenderCounter + 1) % graphColors.length],
        opacity: defaultGraphSettings.opacity,
        width: defaultGraphSettings.width,
        lineDash: defaultGraphSettings.lineDash,
        boundaries: { ...defaultGraphSettings.boundaries },
        pointStyle: defaultGraphSettings.pointStyle,
        label: defaultGraphSettings.label,
      },
    });

    setRerenderCounter(rerenderCounter + 1);
  };

  const deleteMathInput = (index) => {
    var inputToDelete = document.getElementById(`inputContainer${toGraph[index].id}`);
    inputToDelete.classList.add('deleteAnimation');

    setTimeout(() => {
      if (toGraph.length === 1) {
        var id = toGraph[0].id;
        toGraph[0] = {
          id: id,
          func: null,
          renderSinglePoints: false,
          latex: '',
          settings: { ...defaultGraphSettings, boundaries: { ...defaultGraphSettings.boundaries } },
        };

        inputToDelete.classList.remove('deleteAnimation');
      } else toGraph.splice(index, 1);

      setRerenderCounter(rerenderCounter + 1);
      renderGraphs();
    }, 200);
  };

  const handleInputChange = (exp, index) => {
    var points = exp.match(/\\left\(.+?,.+?\\right\),|\\left\(.+?,.+?\\right\)$/g);
    if (points !== undefined && points !== null) {
      toGraph[index].renderSinglePoints = true;
      toGraph[index].points = [];

      points.forEach((pointLatex, i) => {
        pointLatex = pointLatex.replace(/^\\left\(/, '');
        if (points.length - 1 === i) pointLatex = pointLatex.replace(/\\right\)$/, '');
        else pointLatex = pointLatex.replace(/\\right\),$/, '');

        var [pointXLatex, pointYLatex] = pointLatex.split(',');

        console.log('point before:', pointXLatex, pointYLatex);
        var parsedPointXLatex = parseLatex(pointXLatex);
        var parsedPointYLatex = parseLatex(pointYLatex);
        console.log('point after:', parsedPointXLatex, parsedPointYLatex);

        try {
          var x = MATHJS.evaluate(parsedPointXLatex);
          var y = MATHJS.evaluate(parsedPointYLatex);

          toGraph[index].points.push({ x: x, y: y });
        } catch (e) {
          console.log("couldn't evaluate point values", e);
        }
      });
    } else {
      try {
        toGraph[index].renderSinglePoints = false;

        console.log('before:', exp);
        var parsedExpression = parseLatex(exp);
        console.log('after:', parsedExpression);

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
    var offsetX = Math.ceil((baseCenterX - centerX.current) / gridWith);
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
        var { color, opacity, width, lineDash, pointStyle, label } = settings;
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

          renderPoints(contextRef.current, centerX.current, centerY.current, points, oneUnit, width, pointStyle, label);
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

    context.font = '19px PoppinsRegular';
    context.textAlign = 'center';
    context.textBaseline = 'top';
  };

  const handleResize = () => {
    // setWidth(window.innerWidth * 0.75);
    // setHeight(window.innerHeight);
    // baseCenterX = width / 2 + 2.5;
    // baseCenterY = height / 2 + 2.5;
    // setCanvas();
    // renderGraph();
  };

  const handleOnDragEnd = (result) => {
    if (result.destination === null) return;

    var sourceIndex = result.source.index;
    var destinationIndex = result.destination.index;

    var spliced = toGraph.splice(sourceIndex, 1);
    toGraph.splice(destinationIndex, 0, spliced[0]);

    // setRerenderCounter(rerenderCounter + 1);
    renderGraphs();
  };

  const handleSettingsButton = () => {
    setSettingOpened(!settingOpened);
  };

  const handleDomainButton = () => {};

  const handleSetOfValuesButton = () => {};

  const applySettings = () => {
    // theme
    var themeName = settings.general.theme;
    var themeValues = themes[themeName];

    for (const [key, value] of Object.entries(themeValues))
      document.querySelector(':root').style.setProperty(key, value);

    // font size
    var textSize = settings.general.textSize;
    var newFontSize = textSize === 'small' ? '0.9rem' : textSize === 'large' ? '1.15rem' : '1rem';

    document.documentElement.style.fontSize = newFontSize;
  };

  useEffect(() => {
    applySettings();

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
    <div className='appWrapper'>
      <Titlebar
        handleSettingsButton={handleSettingsButton}
        handleDomainButton={handleDomainButton}
        handleSetOfValuesButton={handleSetOfValuesButton}
      />

      <SettingsModal
        open={settingOpened}
        handleClose={() => setSettingOpened(false)}
        applySettingsFunc={applySettings}
      />

      <div className='container'>
        <div className='left'>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='mathInputs'>
              {(provided) => (
                <div className='mathInputsContainer' {...provided.droppableProps} ref={provided.innerRef}>
                  {toGraph.map((obj, index) => (
                    <Draggable draggableId={`${obj.id}`} key={obj.id} index={index} isDragDisabled={false}>
                      {(provided, draggableSnapshot) => (
                        <div {...provided.draggableProps} ref={provided.innerRef} className='mathInputWrapper'>
                          <MathInput
                            callback={handleInputChange}
                            deleteCallback={deleteMathInput}
                            index={index}
                            id={obj.id}
                            expression={obj.latex}
                            rerenderCounter={rerenderCounter}
                            renderGraphs={renderGraphs}
                            provided={provided}
                            isDragging={draggableSnapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <AddButton callback={addNewMathInput} />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className='canvas-wrapper' id='canvas-wrapper'>
          <div
            className='grid'
            style={{
              backgroundPosition: `${dragOffsetX + ((width / 2) % gridWith)}px ${
                dragOffsetY + ((height / 2) % gridHeight) - TITLE_BAR_HEIGHT / 2 - 1
              }px`,
              backgroundSize: `${gridWith}px ${gridHeight}px`,
            }}
          />
          <canvas id='canvas' width={width} height={height} ref={canvasRef}></canvas>
          {/* <div className='y-axis' style={{ left: `${62.5 + (dragOffsetX * 100) / window.innerWidth}vw` }} /> */}

          {settings.axisY.showNegativeHalfAxis ? (
            <div
              className='y-axis'
              style={{
                left: `${62.5 + (dragOffsetX * 100) / window.innerWidth}vw`,
                top: `${Math.max(height / 2 - baseCenterY / 2, dragOffsetY + baseCenterY / 2 - TITLE_BAR_HEIGHT / 2)}px`,
              }}
            />
          ) : null}

          {settings.axisY.showPositiveHalfAxis ? (
            <div
              className='y-axis'
              style={{
                left: `${62.5 + (dragOffsetX * 100) / window.innerWidth}vw`,
                top: `${Math.min(0, dragOffsetY - baseCenterY / 2 + TITLE_BAR_HEIGHT / 2)}px`,
              }}
            />
          ) : null}

          {settings.axisY.showPositiveHalfAxis && settings.axisY.endAxisWithArrow ? (
            <div
              className='y-axis-arrow'
              style={{
                left: `calc(${62.5 + (dragOffsetX * 100) / window.innerWidth}vw - 4px)`,
              }}
            />
          ) : null}

          {settings.axisY.showNegativeHalfAxis || settings.axisY.showPositiveHalfAxis ? (
            <p
              className='y-axis-label'
              style={{ left: `calc(${62.5 + (dragOffsetX * 100) / window.innerWidth}vw + 10px)` }}
            >
              {settings.axisY.label}
            </p>
          ) : null}

          {settings.axisX.showNegativeHalfAxis ? (
            <div
              className='x-axis'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh - ${TITLE_BAR_HEIGHT / 2 + 1}px)`,
                left: `calc(25vw + ${Math.min(dragOffsetX, width / 2)}px - ${width / 2}px)`,
              }}
            />
          ) : null}

          {settings.axisX.showPositiveHalfAxis ? (
            <div
              className='x-axis'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh - ${TITLE_BAR_HEIGHT / 2 + 1}px)`,
                right: `calc(-${width / 2}px + ${Math.min(-dragOffsetX, width / 2)}px)`,
              }}
            />
          ) : null}

          {settings.axisX.showPositiveHalfAxis && settings.axisX.endAxisWithArrow ? (
            <div
              className='x-axis-arrow'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh - ${TITLE_BAR_HEIGHT / 2 + 5}px)`,
              }}
            />
          ) : null}

          {settings.axisX.showNegativeHalfAxis || settings.axisX.showPositiveHalfAxis ? (
            <p
              className='x-axis-label'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh + 19px - ${TITLE_BAR_HEIGHT / 2}px)`,
              }}
            >
              {settings.axisX.label}
            </p>
          ) : null}

          {(settings.axisX.showNegativeHalfAxis && settings.axisX.showNegativeHalfAxisNumbers) ||
          (settings.axisX.showPositiveHalfAxis && settings.axisX.showPositiveHalfAxisNumbers) ||
          (settings.axisY.showNegativeHalfAxis && settings.axisY.showNegativeHalfAxisNumbers) ||
          (settings.axisY.showPositiveHalfAxis && settings.axisY.showPositiveHalfAxisNumbers) ? (
            <p
              className='axis-number'
              style={{
                right: `calc(${37.5 - (dragOffsetX * 100) / window.innerWidth}vw + 7px)`,
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh + 14px + ${TITLE_BAR_HEIGHT / 2}px)`,
              }}
            >
              0
            </p>
          ) : null}
          {/* X axis numbers */}
          {[...Array(Math.ceil(Math.ceil(width / oneUnit) / gapBetweenAxisXNumbers) + 1).keys()].map((i) => {
            i -= Math.floor(Math.ceil(width / oneUnit) / gapBetweenAxisXNumbers / 2);

            var offset =
              Math.round(i * oneUnit * gapBetweenAxisXNumbers) +
              Math.floor((baseCenterX - centerX.current) / (oneUnit * gapBetweenAxisXNumbers)) *
                (oneUnit * gapBetweenAxisXNumbers);
            var axisNumberPosX = baseCenterX / 2 + offset + dragOffsetX;

            // check for pi
            // if (AxisXPi) {
            //   var numberDistFraction = settings.axisX.numbersDistance.toString().replace(':', '/').split('/');
            //   var [numerator, denominator] = numberDistFraction;
            //   numerator = parseFloat(numerator.replace('pi', 1));
            //   denominator = parseFloat(denominator);

            //   if (!isNaN(denominator)) var value = `${i * numerator}π/${denominator}`;
            //   else var value = `${i * numerator}π`;

            //   value.replace('-1π', '-π').replace('1π', 'π').replace('0π', '');
            // } else {
            var value = parseFloat(
              ((axisNumberPosX - baseCenterX / 2) / oneUnit - dragOffsetX / oneUnit).toFixed(1).replace('.0', '')
            );
            // }

            if (value < 0 && (!settings.axisX.showNegativeHalfAxis || !settings.axisX.showNegativeHalfAxisNumbers))
              return;

            if (value > 0 && (!settings.axisX.showPositiveHalfAxis || !settings.axisX.showPositiveHalfAxisNumbers))
              return;

            if (value === 0) return;

            return (
              <p
                key={i}
                className='axis-number x-axis-number'
                style={{
                  top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh + 14px + ${TITLE_BAR_HEIGHT / 2}px)`,
                  left: `calc(25vw + ${axisNumberPosX}px)`,
                }}
              >
                {value.toString().replace('.', ',')}
              </p>
            );
          })}

          {/* Y axis numbers */}
          {[...Array(Math.ceil(Math.ceil(height / oneUnit) / gapBetweenAxisYNumbers) + 1).keys()].map((i) => {
            i -= Math.floor(Math.ceil(height / oneUnit) / gapBetweenAxisYNumbers / 2);

            var offset =
              Math.round(i * oneUnit * gapBetweenAxisYNumbers) +
              Math.floor((baseCenterY - centerY.current) / (oneUnit * gapBetweenAxisYNumbers)) *
                (oneUnit * gapBetweenAxisYNumbers);
            var axisNumberPosY = baseCenterY / 2 + offset + dragOffsetY;

            var value = parseFloat(
              ((axisNumberPosY - baseCenterY / 2) / oneUnit - dragOffsetY / oneUnit).toFixed(1).replace('.0', '') * -1
            );

            if (value < 0 && (!settings.axisY.showNegativeHalfAxis || !settings.axisY.showNegativeHalfAxisNumbers))
              return;

            if (value > 0 && (!settings.axisY.showPositiveHalfAxis || !settings.axisY.showPositiveHalfAxisNumbers))
              return;

            if (value === 0) return;

            if (value === 0) return;

            return (
              <p
                key={i}
                className='axis-number'
                style={{
                  right: `calc(${37.5 - (dragOffsetX * 100) / window.innerWidth}vw + 7px)`,
                  top: `${axisNumberPosY + TITLE_BAR_HEIGHT / 2}px`,
                }}
              >
                {value.toString().replace('.', ',')}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
