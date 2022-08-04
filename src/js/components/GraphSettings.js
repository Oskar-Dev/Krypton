import React, { useEffect, useRef, useState } from 'react';
import { BsBorderWidth } from 'react-icons/bs';
import { TbCircleHalf2 } from 'react-icons/tb';
import { toGraph } from '../../utils/toGraph';
import { CirclePicker } from 'react-color';
import { graphColors } from '../../utils/graphColors';
import { TbLineDashed, TbLineDotted } from 'react-icons/tb';
import { CgBorderStyleSolid } from 'react-icons/cg';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill.min.js');

import '../../mathquill-0.10.1/mathquill.css';
import './GraphSettings.scss';

const colorPickerColors = [...graphColors, '#ffffff', '#141013'];

const GraphSettings = ({ blurCallback, index, forceRerender }) => {
  const containerRef = useRef(null);
  const { settings } = toGraph[index];
  const [opacity, setOpacity] = useState(settings.opacity);
  const [width, setWidth] = useState(settings.width);
  const [color, setColor] = useState(settings.color);
  const [lineDash, setLineDash] = useState(settings.lineDash);

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

  useEffect(() => {
    containerRef.current.focus();

    // create dynamic mathfields
    var MQ = MathQuill.getInterface(2);
    var ids = [`${index}` + '0', `${index}` + '1'];

    ids.forEach((id) => {
      var mathFieldSpan = document.getElementById(id);
      MQ.MathField(mathFieldSpan, {
        restrictMismatchedBrackets: true,
        charsThatBreakOutOfSupSub: '+-',
        autoCommands: 'pi phi sqrt',
        handlers: {},
      });
    });

    // create static mathfield
    var staticMathFieldSpan = document.getElementById('staticMathField');
    MQ.StaticMath(staticMathFieldSpan);
  }, []);

  return (
    <div
      className='graphSettingsContainer'
      style={{ outlineColor: color }}
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
          <div className='inlineWrapper graphBoundarySettingsWrapper'>
            <span
              id={`${index}` + '0'}
              className='graphBoundaryField inputBottomBorder centerVerically'
              tabIndex={0}
            ></span>
            <span id='staticMathField' className='centerVerically'>
              {'\\leq x \\leq'}
            </span>
            <span
              id={`${index}` + '1'}
              className='graphBoundaryField inputBottomBorder centerVerically'
              tabIndex={0}
            ></span>
          </div>
        </div>

        <div className='settingsRight centerVerically'>
          <div className='lineDashWrapper inlineWrapper addMarginTop'>
            <div className={'icon lineDashIcon ' + (lineDash === 0 ? 'selected' : 'notSelected')} id='lineDash0'>
              <CgBorderStyleSolid
                className='rotate45deg'
                size={36}
                onClick={() => {
                  updateValue('lineDash', 0);
                  setLineDash(0);
                }}
              />
            </div>
            <div className={'icon lineDashIcon ' + (lineDash === 1 ? 'selected' : 'notSelected')} id='lineDash1'>
              <TbLineDashed
                className='rotate45deg'
                size={36}
                onClick={() => {
                  updateValue('lineDash', 1);
                  setLineDash(1);
                }}
              />
            </div>
            <div className='inlineWrapper'>
              <div className={'icon lineDashIcon ' + (lineDash === 2 ? 'selected' : 'notSelected')} id='lineDash2'>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphSettings;
