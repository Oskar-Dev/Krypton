import React, { useState } from 'react';
import './MathInput.scss';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

const MathInput = ({ callback }) => {
  return (
    <div className='inputContainer'>
      <button
        className='deleteButton'
        onClickCapture={(e) => e.target.blur()}
        // onDrag={(e) => e.target.blur()}
        tabindex='-1'
      ></button>
      <input
        spellCheck='false'
        onChange={(e) => {
          var value = e.target.value;
          callback(value);
        }}
      ></input>
      <TeX className='math' style={{ color: 'white' }}>
        {'f(x)='}
      </TeX>
      <div className='box'></div>
    </div>
  );
};

export default MathInput;
