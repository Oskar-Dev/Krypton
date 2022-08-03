import React, { useEffect, useRef, useState } from 'react';
import './GraphSettings.scss';
import { BsBorderWidth } from 'react-icons/bs';
import { TbCircleHalf2 } from 'react-icons/tb';
import { toGraph, lineDashStyles } from '../../utils/toGraph';
import { CirclePicker } from 'react-color';
import { graphColors } from '../../utils/graphColors';
import { TbLineDashed, TbLineDotted } from 'react-icons/tb';
import { CgBorderStyleSolid } from 'react-icons/cg';

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

      <div className='inlineWrapper settingsWrapper'>
        <div>
          <div className='inlineWrapper'>
            <div className='icon'>
              <TbCircleHalf2 size={20} />
            </div>

            <input
              className='input'
              value={opacity}
              onChange={(e) => {
                var value = e.target.value;

                updateValue('opacity', value);
                setOpacity(value);
              }}
            />
          </div>

          <div className='inlineWrapper'>
            <div className='icon'>
              <BsBorderWidth size={20} />
            </div>

            <input
              className='input'
              value={width}
              onChange={(e) => {
                var value = e.target.value;

                updateValue('width', value);
                setWidth(value);
              }}
            />
          </div>
        </div>

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

      <div className='lineDashWrapper inlineWrapper'>
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
  );
};

export default GraphSettings;
