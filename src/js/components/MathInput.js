import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { replaceAll } from '../../utils/replaceAll';
import { BsGearFill } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill.min.js');

import '../../mathquill-0.10.1/mathquill.css';
import './MathInput.scss';

const MathInput = ({ callback, deleteCallback, index, expression, rerenderCounter }) => {
  const id = `mathField${index}`;

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
            color: '#4da6ff',
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

  const openSettings = () => {
    console.log('settings button');
  };

  return (
    <div className='inputContainer'>
      <div className='deleteButton buttonWrapper'>
        <MdClear className='button' size={36} onClick={() => deleteCallback(index)} />
      </div>

      <span id={id} className='mathField' tabIndex={1}></span>

      <div className='box settingsButton'>
        <BsGearFill className='button' size={24} onClick={() => openSettings()} />
      </div>
    </div>
  );
};

export default MathInput;
