import React, { useEffect, useRef, useState } from 'react';
import { BsBorderWidth } from 'react-icons/bs';
import { TbCircleHalf2 } from 'react-icons/tb';
import { toGraph } from '../../utils/toGraph';
import { CirclePicker } from 'react-color';
import { graphColors } from '../../utils/graphColors';
import { TbLineDashed, TbLineDotted } from 'react-icons/tb';
import { CgBorderStyleSolid } from 'react-icons/cg';
import { VscCircleFilled, VscCircleOutline } from 'react-icons/vsc';
import { MATHJS } from '../../utils/MATHJS.js';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill.min.js');

import '../../mathquill-0.10.1/mathquill.css';
import './GraphSettings.scss';
import { parseLatex } from '../../utils/parseLatex';

const colorPickerColors = [...graphColors, '#ffffff', '#141013'];

const GraphSettings = ({ blurCallback, index, forceRerender }) => {
  const containerRef = useRef(null);
  const { renderSinglePoints, settings } = toGraph[index];
  const [opacity, setOpacity] = useState(settings.opacity);
  const [width, setWidth] = useState(settings.width);
  const [color, setColor] = useState(settings.color);
  const [lineDash, setLineDash] = useState(settings.lineDash);
  const [pointStyle, setPointStyle] = useState(settings.pointStyle);
  const [boundaryLatexLeft, setBoundaryLatexLeft] = useState(settings.boundaries.latexLeft);
  const [boundaryLatexRight, setBoundaryLatexRight] = useState(settings.boundaries.latexRight);
  const [label, setLabel] = useState(settings.label);
  const parentMathField = document.getElementById(`inputContainer${toGraph[index].id}`);
  const parentMathFieldY = parentMathField.getBoundingClientRect().y;
  const parentMathFieldHeight = parentMathField.offsetHeight;
  const top = parentMathFieldY + parentMathFieldHeight / 2 - 20;

  const handleBlur = (event) => {
    // if the blur was because of outside focus
    // currentTarget is the parent element, relatedTarget is the clicked element
    if (!event.currentTarget.contains(event.relatedTarget)) {
      blurCallback();
    }
  };

  const updateValue = (valueName, value) => {
    toGraph[index].settings[valueName] = value;
    forceRerender();
  };

  const handleColorChange = (col) => {
    toGraph[index].settings.color = col.hex;
    setColor(col.hex);
    forceRerender();
  };

  const handleBoundaryChange = (latex, leftOrRight) => {
    if (latex !== null && latex !== undefined && latex !== '') {
      var parsedLatex = parseLatex(latex);

      try {
        var value = MATHJS.evaluate(parsedLatex);

        toGraph[index].settings.boundaries['latex' + leftOrRight] = latex;
        toGraph[index].settings.boundaries[leftOrRight.toLowerCase()] = value;

        forceRerender();
      } catch (e) {
        console.log("couldn't evaluate boundary value", e);

        toGraph[index].settings.boundaries['latex' + leftOrRight] = null;
        toGraph[index].settings.boundaries[leftOrRight.toLowerCase()] = null;

        forceRerender();
      }
    } else {
      toGraph[index].settings.boundaries['latex' + leftOrRight] = null;
      toGraph[index].settings.boundaries[leftOrRight.toLowerCase()] = null;

      forceRerender();
    }
  };

  useEffect(() => {
    containerRef.current.focus();

    // create dynamic mathfields
    var MQ = MathQuill.getInterface(2);
    var ids = [`${index}` + '0', `${index}` + '1'];

    ids.forEach((id, i) => {
      var mathFieldSpan = document.getElementById(id);
      var boundaryField = MQ.MathField(mathFieldSpan, {
        restrictMismatchedBrackets: true,
        charsThatBreakOutOfSupSub: '+-',
        autoCommands: 'pi phi sqrt',
        autoOperatorNames: 'sin cos tg tan ctg cot log ln abs',
        handlers: {
          edit: () => {
            var latex = boundaryField.latex();
            var leftOrRight = i === 0 ? 'Left' : 'Right';

            handleBoundaryChange(latex, leftOrRight);
          },
        },
      });
    });

    // create static mathfield
    var staticMathFieldSpan = document.getElementById('staticMathField');
    MQ.StaticMath(staticMathFieldSpan);
  }, []);

  return (
    <div
      className='graphSettingsContainer'
      style={{ outlineColor: color, top: top }}
      ref={containerRef}
      tabIndex={0}
      onBlur={(event) => handleBlur(event)}
    >
      <div className='arrow' style={{ borderRight: `10px solid ${color}` }}>
        {/* <div className='innerArrow'></div> */}
      </div>

      <div className='settingsWrapper'>
        <div className='settingsLeft'>
          <div className='inlineWrapper'>
            <div className='icon'>
              <TbCircleHalf2 size={20} />
            </div>

            <input
              className='input inputBottomBorder'
              value={opacity}
              onChange={(e) => {
                var value = e.target.value;

                updateValue('opacity', value);
                setOpacity(value);
              }}
            />
          </div>

          <div className='inlineWrapper addMarginTop'>
            <div className='icon'>
              <BsBorderWidth size={20} />
            </div>

            <input
              className='input inputBottomBorder'
              value={width}
              onChange={(e) => {
                var value = e.target.value;

                updateValue('width', value);
                setWidth(value);
              }}
            />
          </div>
        </div>

        <div className='settingsRight'>
          <CirclePicker
            className='colorPicker'
            width='205px'
            circleSize={24}
            circleSpacing={5}
            colors={colorPickerColors}
            color={color}
            onChange={handleColorChange}
          />
        </div>
      </div>

      <div className='settingsWrapper'>
        <div className='settingsLeft centerVerically'>
          {!renderSinglePoints ? (
            <div className='inlineWrapper graphBoundarySettingsWrapper'>
              <span id={`${index}` + '0'} className='graphBoundaryField inputBottomBorder centerVerically' tabIndex={0}>
                {boundaryLatexLeft}
              </span>
              <span id='staticMathField' className='centerVerically'>
                {'\\leq x \\leq'}
              </span>
              <span id={`${index}` + '1'} className='graphBoundaryField inputBottomBorder centerVerically' tabIndex={0}>
                {boundaryLatexRight}
              </span>
            </div>
          ) : (
            <div className='labelInputWrapper'>
              <div className='inputLabelWrapper'>
                <span className='inputLabel'>A</span>
              </div>
              <input
                className='input inputBottomBorder labelInput'
                onChange={(e) => {
                  var label = e.target.value;
                  updateValue('label', label);
                  setLabel(label);
                }}
                defaultValue={label}
              ></input>
            </div>
          )}
        </div>

        <div className='settingsRight centerVerically'>
          {!renderSinglePoints ? (
            <div className='lineDashWrapper inlineWrapper addMarginTop'>
              <div className={'icon styleButtonIcon styleButton0 ' + (lineDash === 0 ? 'selected' : 'notSelected')}>
                <CgBorderStyleSolid
                  className='rotate45deg'
                  size={36}
                  onClick={() => {
                    updateValue('lineDash', 0);
                    setLineDash(0);
                  }}
                />
              </div>
              <div className={'icon styleButtonIcon styleButton1 ' + (lineDash === 1 ? 'selected' : 'notSelected')}>
                <TbLineDashed
                  className='rotate45deg'
                  size={36}
                  onClick={() => {
                    updateValue('lineDash', 1);
                    setLineDash(1);
                  }}
                />
              </div>
              <div className={'icon styleButtonIcon styleButton2 ' + (lineDash === 2 ? 'selected' : 'notSelected')}>
                <TbLineDotted
                  className='rotate45deg'
                  size={36}
                  onClick={() => {
                    updateValue('lineDash', 2);
                    setLineDash(2);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className='lineDashWrapper inlineWrapper addMarginTop'>
              <button
                className={'icon styleButtonIcon styleButton0 ' + (pointStyle === 0 ? 'selected' : 'notSelected')}
                onClick={() => {
                  updateValue('pointStyle', 0);
                  setPointStyle(0);
                }}
              >
                <VscCircleFilled className='rotate45deg' size={27} />
              </button>
              <button
                className={'icon styleButtonIcon styleButton2 ' + (pointStyle === 1 ? 'selected' : 'notSelected')}
                onClick={() => {
                  updateValue('pointStyle', 1);
                  setPointStyle(1);
                }}
              >
                <VscCircleOutline className='rotate45deg' size={27} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphSettings;
