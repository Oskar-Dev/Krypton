import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { replaceAll } from '../../utils/replaceAll';
import { BsGearFill, BsGear } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill.min.js');

import '../../mathquill-0.10.1/mathquill.css';
import './MathInput.scss';
import { graphColors } from '../../utils/graphColors';
import GraphSettings from './GraphSettings';

const MathInput = ({ callback, deleteCallback, index, expression, rerenderCounter }) => {
  const [focus, setFocus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const id = `mathField${index}`;
  const [graphColor, setGraphColor] = useState(graphColors[rerenderCounter % graphColors.length]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    var MQ = MathQuill.getInterface(2);
    var mathFieldSpan = document.getElementById(id);
    var mathField = MQ.MathField(mathFieldSpan, {
      spaceBehavesLikeTab: true, // configurable
      charsThatBreakOutOfSupSub: '+-',
      handlers: {
        edit: () => {
          var latex = mathField.latex();
          // latex = replaceAll(latex, '\\left', '');
          // latex = replaceAll(latex, '\\right', '');

          const config = {
            color: graphColor,
          };

          callback(latex, index, config);
        },
      },
    });
  }, []);

  useEffect(() => {
    var MQ = MathQuill.getInterface(2);
    var mathFieldSpan = document.getElementById(id);
    var mathField = MQ.MathField(mathFieldSpan);

    if (expression === undefined) mathField.latex('\\vphantom');
    else mathField.latex(expression);
  }, [expression, rerenderCounter]);

  return (
    <div className={`inputContainer ${focus ? 'focus' : ''}`}>
      {showSettings ? <GraphSettings callback={toggleSettings} /> : null}

      <div className='deleteButton buttonWrapper'>
        <MdClear className='icon' size={36} onClick={() => deleteCallback(index)} />
      </div>

      <span
        id={id}
        className='mathField'
        tabIndex={0}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      ></span>

      <div className='box settingsButton'>
        <BsGear className='icon' color={graphColor} size={24} onClick={() => toggleSettings()} />
        <BsGearFill className='iconFill' color={graphColor + '3C'} size={24} />
      </div>
    </div>
  );
};

export default MathInput;
