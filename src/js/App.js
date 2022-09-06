import React, { useEffect, useRef, useState } from 'react';
import MathInput from './components/MathInput';
import { clamp, lerp, pointDistance } from '../utils/Maths';
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
import { MdHome, MdZoomIn, MdZoomOut } from 'react-icons/md';

import '../styles/globals.css';
import '../styles/App.css';
import { replaceAll } from '../utils/replaceAll';

const TITLE_BAR_HEIGHT = 32;
const DEFAULT_ONE_UNIT = 60;

const getWindowHeight = () => {
  return window.innerHeight;
};

const App = () => {
  const [settingsOpened, setsettingsOpened] = useState(false);
  const [rerenderCounter, setRerenderCounter] = useState(0);

  var width = window.innerWidth * 0.75;
  var height = getWindowHeight();
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const firstUpdate = useRef(true);

  var formatPrecision = 14;

  var domainAnimation = useRef(false);
  var setOfValuesAnimation = useRef(false);
  var animationLerpSpeed = 0.03;
  var stopAnimationError = 0.00001;

  var oneUnit = useRef(DEFAULT_ONE_UNIT);
  var zoomSpeed = 2;
  var zoomSpeedButton = 10;
  var minZoom = 10;
  var maxZoom = 150;
  var zoomButtonSize = 26;

  var animationIntervalTime = 10;
  var gridWith = parseFloat(settings.grid.width.toString().replace(',', '.')) * oneUnit.current;
  var gridHeight = parseFloat(settings.grid.height.toString().replace(',', '.')) * oneUnit.current;

  if (isNaN(gridWith)) gridWith = defaultSettings.grid.width * oneUnit.current;
  if (isNaN(gridHeight)) gridHeight = defaultSettings.grid.height * oneUnit.current;

  var numbersDistanceX = parseFloat(settings.axisX.numbersDistance.toString().replace(',', '.').replace('pi', Math.PI));
  var numbersDistanceY = parseFloat(settings.axisY.numbersDistance.toString().replace(',', '.').replace('pi', Math.PI));

  var gapBetweenAxisXNumbers =
    !isNaN(numbersDistanceX) && numbersDistanceX > 0 ? numbersDistanceX : defaultSettings.axisX.numbersDistance;
  var gapBetweenAxisYNumbers =
    !isNaN(numbersDistanceY) && numbersDistanceY > 0 ? numbersDistanceY : defaultSettings.axisY.numbersDistance;

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

  var resizeTimeout;

  // var wrapWidth = Math.floor(width / gridSize) * gridSize + gridSize;
  // var wrapHeight = Math.floor(height / gridSize) * gridSize + gridSize;
  // var wrapsX = Math.abs(Math.floor((baseCenterX / 2 - dragOffsetX) / wrapWidth));
  // var wrapsY = Math.abs(Math.floor((baseCenterY / 2 - dragOffsetY) / wrapHeight));

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
        ...defaultGraphSettings,
        color: graphColors[(rerenderCounter + 1) % graphColors.length],
        boundaries: { ...defaultGraphSettings.boundaries },
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

  const handleEnteredExpression = (exp, index) => {
    toGraph[index].renderSinglePoints = false;

    console.log('before:', exp);
    var parsedExpression = parseLatex(exp);
    console.log('after:', parsedExpression);

    var sides = parsedExpression.split('=');

    switch (sides.length) {
      case 1:
        toGraph[index].expressionLeftSide = null;
        toGraph[index].expressionRightSide = parsedExpression;
        toGraph[index].parsedExpression = null;
        var fn = MATHJS.compile(parsedExpression);
        break;

      case 2:
        var [leftSide, rightSide] = sides;

        var singleLetterMatch = leftSide.match(/^[a-zA-Z]$/g);
        var functionMatch = leftSide.match(/^[a-zA-Z]\([xy]\)$/g);

        if (singleLetterMatch === null && functionMatch === null) {
          toGraph[index].func = null;
          console.log('invalid expression');
        } else {
          toGraph[index].expressionLeftSide = leftSide;
          toGraph[index].expressionRightSide = rightSide;

          if (leftSide.match(/^x|.\(y\)$/g) !== null) rightSide = replaceAll(rightSide, 'y', 'x');

          var fn = MATHJS.compile(rightSide);
        }

        toGraph[index].parsedExpression = parsedExpression;

        break;

      default:
        toGraph[index].func = null;
        toGraph[index].parsedExpression = null;
        console.log('invalid expression');
    }

    toGraph[index].func = fn;
    toGraph[index].parsedExpression = parsedExpression;
  };

  const handleInputChange = (exp, index) => {
    stopAnimations();

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

          toGraph[index].points.push({ x: x, y: y, x_0: x, y_0: y });
        } catch (e) {
          console.log("couldn't evaluate point values", e);
        }
      });
    } else {
      try {
        handleEnteredExpression(exp, index);
      } catch (e) {
        console.log("couldn't compile function", e);
        toGraph[index].constValue = null;
        toGraph[index].expressionRightSide = null;
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

  const updatePoints = (index, scope, rotateGraph) => {
    var data = toGraph[index];
    var { func, renderSinglePoints } = data;
    var { boundaries } = data.settings;

    if (!renderSinglePoints) {
      if (func === null) {
        data.points = [];
        return;
      }

      var quality = parseFloat(settings.advanced.graphQuality.toString().replace(',', '.'));
      var delta = isNaN(quality) ? defaultSettings.advanced.graphQuality : clamp(quality, 0.01, 1);
      var n = Math.floor(width / (2 * oneUnit.current) + updateDist / oneUnit.current);

      var offsetX = Math.ceil((baseCenterX - centerX.current) / oneUnit.current);
      var offsetY = Math.ceil((baseCenterY - centerY.current) / oneUnit.current);

      if (rotateGraph) var offset = -offsetY;
      else var offset = offsetX;

      var from = -n + offset - 1;
      var to = n + offset + 1;

      if (boundaries.left !== null) from = Math.max(boundaries.left, from);

      if (boundaries.right !== null) to = Math.min(boundaries.right, to);

      data.points = evaluatePoints(func, from, to, scope, delta);
    } else {
      for (var i = 0; i < data.points.length; i++) {
        data.points[i].x = data.points[i].x_0;
        data.points[i].y = data.points[i].y_0;
      }
    }
  };

  const renderGraphs = (update = true) => {
    setCanvas();
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (update && (!domainAnimation.current || !setOfValuesAnimation.current)) stopAnimations();

    var scope = {};

    for (var i = 0; i < toGraph.length; i++) {
      try {
        if (toGraph[i] === undefined) continue;

        var { renderSinglePoints, settings, expressionLeftSide, expressionRightSide, parsedExpression } = toGraph[i];
        var { color, opacity, width, lineDash, pointStyle, label } = settings;
        var lineDashStyle;
        var rotateGraph = false;

        // add to scope
        try {
          if (parsedExpression !== null) MATHJS.evaluate(parsedExpression, scope);
        } catch (e) {
          console.log("couldn't add to scope:", parsedExpression);
        }

        // try to evaluate the right side
        try {
          var rightSideValue = parseFloat(MATHJS.evaluate(expressionRightSide));
          rightSideValue = MATHJS.format(rightSideValue, { precision: formatPrecision });
          toGraph[i].constValue = rightSideValue;
        } catch (e) {
          toGraph[i].constValue = null;
          console.log("Right side of the expression isn't a const");
        }

        // check if only set variable && for main arg
        if (expressionLeftSide !== null && expressionRightSide !== null) {
          // var matches = expressionLeftSide.match(/^[a-wzA-Z]$/g);
          // if (matches !== null) {
          //   scope[expressionLeftSide] = expressionRightSide;
          //   continue;
          // }

          var match = expressionLeftSide.match(/^x|.\(y\)$/g);
          rotateGraph = !(match === null);

          if (rotateGraph && expressionRightSide.includes('x')) continue;
        }

        // opacity
        var opacity_ = Math.floor(parseFloat(opacity) * 255);
        if (isNaN(opacity_) || opacity_ === undefined || opacity_ === null || opacity_ > 255 || opacity_ < 0)
          opacity_ = 255;

        var opacityHex = opacity_.toString(16);
        if (opacityHex.length === 1) opacityHex = '0' + opacityHex;

        // color & width
        context.strokeStyle = color + opacityHex;
        context.lineWidth = width === '' ? 1 : width;

        // update points
        if (update) updatePoints(i, scope, rotateGraph);

        if (renderSinglePoints) {
          var { points } = toGraph[i];

          // set linedash style to the default one to avoid weird looking points
          context.setLineDash(lineDashStyles[0]);

          context.font = '1.375rem PoppinsRegular';

          renderPoints(
            contextRef.current,
            centerX.current,
            centerY.current,
            points,
            oneUnit.current,
            width,
            pointStyle,
            label
          );
        } else {
          var { points } = toGraph[i];

          // line dash
          if (lineDash === 0) lineDashStyle = lineDashStyles[0];
          else if (lineDash === 1)
            lineDashStyle = [lineDashStyles[lineDash][0] * width * 0.25, lineDashStyles[lineDash][1] * width * 0.225];
          else lineDashStyle = [lineDashStyles[lineDash][0], lineDashStyles[lineDash][1] * width * 0.25];

          context.setLineDash(lineDashStyle);

          // render
          renderGraph(contextRef.current, centerX.current, centerY.current, points, oneUnit.current, rotateGraph);
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

  const onResizeEnd = () => {
    width = window.innerWidth * 0.75;
    height = getWindowHeight();

    baseCenterX = width;
    baseCenterY = height;

    centerX.current = baseCenterX;
    centerY.current = baseCenterY;

    setDragOffsetX(0);
    setDragOffsetY(0);

    setRerenderCounter((currentRerenderCounter) => currentRerenderCounter + 1);

    renderGraphs();
  };

  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(onResizeEnd, 200);
  };

  const handleScroll = (event) => {
    const sign = -Math.sign(event.deltaY);

    handleZoom(oneUnit.current + sign * zoomSpeed);
  };

  const handleZoom = (value) => {
    oneUnit.current = clamp(value, minZoom, maxZoom);
    setRerenderCounter((currentRerenderCounter) => currentRerenderCounter + 1);
  };

  const handleZoomDefaultButton = () => {
    setDragOffsetX(0);
    setDragOffsetY(0);

    centerX.current = baseCenterX;
    centerY.current = baseCenterY;

    handleZoom(DEFAULT_ONE_UNIT);
  };

  const handleZoomInButton = () => {
    handleZoom(oneUnit.current + zoomSpeedButton);
  };

  const handleZoomOutButton = () => {
    handleZoom(oneUnit.current - zoomSpeedButton);
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
    setsettingsOpened(!settingsOpened);
  };

  const handleDomainButton = () => {
    if (domainAnimation.current) {
      renderGraphs();
      return;
    } else if (setOfValuesAnimation.current) {
      renderGraphs();
    }

    domainAnimation.current = true;

    var interval = setInterval(() => {
      var break_ = true;
      for (var i = 0; i < toGraph.length; i++) {
        var data = toGraph[i];
        var { points } = data;

        if (!domainAnimation.current || setOfValuesAnimation.current) {
          clearInterval(interval);
          break;
        }

        for (var j = 0; j < points.length; j++) {
          var point = points[j];
          point.y = lerp(point.y, 0, animationLerpSpeed);
          point.lim = 0;

          if (Math.abs(point.y) > stopAnimationError) break_ = false;
        }
      }

      if (break_ || !domainAnimation.current || setOfValuesAnimation.current) clearInterval(interval);
      renderGraphs(false);
    }, animationIntervalTime);
  };

  const handleSetOfValuesButton = () => {
    if (setOfValuesAnimation.current) {
      renderGraphs();
      return;
    } else if (domainAnimation.current) {
      renderGraphs();
    }

    setOfValuesAnimation.current = true;

    // remove not needed points
    var setOfValues = new Set();
    for (var i = 0; i < toGraph.length; i++) {
      var { points, renderSinglePoints, settings } = toGraph[i];
      var { pointStyle } = settings;

      if (renderSinglePoints && pointStyle === 1) continue;

      for (var j = 0; j < points.length; j++) {
        if (j === 0 || j === points.length - 1) continue;
        var point = points[j];

        setOfValues.add(point.y);
      }
    }

    for (var i = 0; i < toGraph.length; i++) {
      var { points, renderSinglePoints, settings } = toGraph[i];
      var { pointStyle } = settings;

      if (!renderSinglePoints || pointStyle === 0) continue;

      for (var j = 0; j < points.length; j++) {
        var point = points[j];

        if (setOfValues.has(point.y)) point.y = undefined;
      }
    }

    var interval = setInterval(() => {
      var break_ = true;
      for (var i = 0; i < toGraph.length; i++) {
        var data = toGraph[i];
        var { points } = data;

        if (!setOfValuesAnimation.current || domainAnimation.current) {
          clearInterval(interval);
          break;
        }

        for (var j = 0; j < points.length; j++) {
          var point = points[j];
          point.x = lerp(point.x, 0, animationLerpSpeed);
          point.lim = 0;

          if (Math.abs(point.x) > stopAnimationError) break_ = false;
        }
      }

      if (break_ || !setOfValuesAnimation.current || domainAnimation.current) clearInterval(interval);
      renderGraphs(false);
    }, animationIntervalTime);
  };

  const stopAnimations = () => {
    domainAnimation.current = false;
    setOfValuesAnimation.current = false;
  };

  const applyThemeAndFontSettings = () => {
    // theme
    var themeName = settings.general.theme;
    var themeValues = themes[themeName];

    for (const [key, value] of Object.entries(themeValues))
      document.querySelector(':root').style.setProperty(key, value);

    // font size
    var textSize = settings.general.textSize;
    var newFontSize = textSize === 'small' ? '0.9rem' : textSize === 'large' ? '1.15rem' : '1rem';

    document.documentElement.style.fontSize = newFontSize;

    renderGraphs();
  };

  useEffect(() => {
    window.api.send('loadSettings');

    window.api.receive('loadedSettings', (data) => {
      var { data, loaded } = data;

      if (loaded) var parsedData = JSON.parse(data);
      else parsedData = defaultSettings;

      settings.general = { ...parsedData.general };
      settings.axisX = { ...parsedData.axisX };
      settings.axisY = { ...parsedData.axisY };
      settings.grid = { ...parsedData.grid };
      settings.advanced = { ...parsedData.advanced };

      applyThemeAndFontSettings();
      setRerenderCounter(rerenderCounter + 1);
      // renderGraphs();
    });

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

    window.addEventListener('resize', handleResize);
    canvasRef.current.addEventListener('wheel', (event) => handleScroll(event));

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current.removeEventListener('wheel', (event) => handleScroll(event));
    };
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (settingsOpened) return;

    window.api.send('saveSettings', JSON.stringify(settings));
  }, [settingsOpened]);

  return (
    <div className='appWrapper'>
      <Titlebar
        handleSettingsButton={handleSettingsButton}
        handleDomainButton={handleDomainButton}
        handleSetOfValuesButton={handleSetOfValuesButton}
      />

      <SettingsModal
        open={settingsOpened}
        handleClose={() => setsettingsOpened(false)}
        applyThemeAndFontSettings={applyThemeAndFontSettings}
        rerenderGraphs={renderGraphs}
      />

      <div className='container'>
        <div className='zoomButtonsWrapper'>
          <MdHome size={zoomButtonSize} className='zoomButton' onClick={handleZoomDefaultButton} />
          <MdZoomIn size={zoomButtonSize} className='zoomButton' onClick={handleZoomInButton} />
          <MdZoomOut size={zoomButtonSize} className='zoomButton' onClick={handleZoomOutButton} />
        </div>

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
          {settings.grid.show ? (
            <div
              className='grid'
              style={{
                backgroundPosition: `${dragOffsetX + ((width / 2) % gridWith) - 1}px ${
                  dragOffsetY + ((height / 2) % gridHeight) - TITLE_BAR_HEIGHT / 2
                }px`,
                backgroundSize: `${gridWith}px ${gridHeight}px`,
              }}
            />
          ) : null}

          {settings.grid.showSmallGrid && settings.grid.show ? (
            <div
              className='grid smallGrid'
              style={{
                backgroundPosition: `${dragOffsetX + ((width / 2) % gridWith) - 1}px ${
                  dragOffsetY + ((height / 2) % gridHeight) - TITLE_BAR_HEIGHT / 2
                }px`,
                backgroundSize: `${gridWith / 4}px ${gridHeight / 4}px`,
              }}
            />
          ) : null}

          <canvas id='canvas' width={width} height={height} ref={canvasRef} />
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
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh - ${TITLE_BAR_HEIGHT / 2}px)`,
                left: `calc(25vw + ${Math.min(dragOffsetX, width / 2)}px - ${width / 2}px)`,
              }}
            />
          ) : null}

          {settings.axisX.showPositiveHalfAxis ? (
            <div
              className='x-axis'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh - ${TITLE_BAR_HEIGHT / 2}px)`,
                right: `calc(-${width / 2}px + ${Math.min(-dragOffsetX, width / 2)}px)`,
              }}
            />
          ) : null}

          {settings.axisX.showPositiveHalfAxis && settings.axisX.endAxisWithArrow ? (
            <div
              className='x-axis-arrow'
              style={{
                top: `calc(${50 + (dragOffsetY * 100) / getWindowHeight()}vh - ${TITLE_BAR_HEIGHT / 2 + 4}px)`,
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
          {[...Array(Math.ceil(Math.ceil(width / oneUnit.current) / gapBetweenAxisXNumbers) + 1).keys()].map((i) => {
            i -= Math.floor(Math.ceil(width / oneUnit.current) / gapBetweenAxisXNumbers / 2);

            var offset =
              Math.round(i * oneUnit.current * gapBetweenAxisXNumbers) +
              Math.floor((baseCenterX - centerX.current) / (oneUnit.current * gapBetweenAxisXNumbers)) *
                (oneUnit.current * gapBetweenAxisXNumbers);
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
              ((axisNumberPosX - baseCenterX / 2) / oneUnit.current - dragOffsetX / oneUnit.current)
                .toFixed(1)
                .replace('.0', '')
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
          {[...Array(Math.ceil(Math.ceil(height / oneUnit.current) / gapBetweenAxisYNumbers) + 1).keys()].map((i) => {
            i -= Math.floor(Math.ceil(height / oneUnit.current) / gapBetweenAxisYNumbers / 2);

            var offset =
              Math.round(i * oneUnit.current * gapBetweenAxisYNumbers) +
              Math.floor((baseCenterY - centerY.current) / (oneUnit.current * gapBetweenAxisYNumbers)) *
                (oneUnit.current * gapBetweenAxisYNumbers);
            var axisNumberPosY = baseCenterY / 2 + offset + dragOffsetY;

            var value = parseFloat(
              ((axisNumberPosY - baseCenterY / 2) / oneUnit.current - dragOffsetY / oneUnit.current)
                .toFixed(1)
                .replace('.0', '') * -1
            );

            if (value < 0 && (!settings.axisY.showNegativeHalfAxis || !settings.axisY.showNegativeHalfAxisNumbers))
              return;

            if (value > 0 && (!settings.axisY.showPositiveHalfAxis || !settings.axisY.showPositiveHalfAxisNumbers))
              return;

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
