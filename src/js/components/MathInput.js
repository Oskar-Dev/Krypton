import React, { useState } from 'react';
import './MathInput.scss';

const MathInput = ({ callback }) => {
  return (
    <div className='inputContainer'>
      <input onChange={(e) => callback(e.target.value)}></input>
      <div className='box'></div>
    </div>
  );
};

export default MathInput;
