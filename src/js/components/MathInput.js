import React, { useEffect, useRef, useState } from 'react';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import { ReplaceList } from '../../utils/FunctionReplaceList';
import { replaceAll } from '../../utils/replaceAll';
import { BsGearFill } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill');

import '../../mathquill-0.10.1/mathquill.css';
import './MathInput.scss';

const mathQuill = MathQuill.getInterface(2);

const MathInput = ({ callback }) => {
  useEffect(() => {
    var mathFieldSpan = document.getElementById('math-field');
    var MQ = MathQuill.getInterface(2); // for backcompat
    var mathField = MQ.MathField(mathFieldSpan, {
      spaceBehavesLikeTab: true, // configurable
      charsThatBreakOutOfSupSub: '+-',
      handlers: {
        edit: () => {
          var latex = mathField.latex();
          latex = replaceAll(latex, '\\left', '');
          latex = replaceAll(latex, '\\right', '');

          callback(latex);
        },
      },
    });
  }, []);

  const openSettings = () => {
    console.log('settings button');
  };

  const handleDelete = () => {
    console.log('delete button');
  };

  return (
    <div className='inputContainer'>
      <div className='deleteButton buttonWrapper'>
        <MdClear className='button' size={36} onClick={() => handleDelete()} />
      </div>

      <span id='math-field' tabIndex={1}></span>

      <div className='box settingsButton'>
        <BsGearFill className='button' size={24} onClick={() => openSettings()} />
      </div>
    </div>
  );
};

export default MathInput;
