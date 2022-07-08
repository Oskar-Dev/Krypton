import React from 'react';
import './MathInput.scss';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import { ReplaceList } from '../../utils/FunctionReplaceList';
import { replaceAll } from '../../utils/replaceAll';
import { BsGearFill } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';

const MathInput = ({ callback }) => {
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
      <input
        spellCheck='false'
        onChange={(e) => {
          var value = e.target.value;
          var keys = Object.keys(ReplaceList);

          keys.forEach((key) => {
            value = replaceAll(value, key, ReplaceList[key]);
          });

          callback(value);
        }}
      ></input>
      <TeX className='math' style={{ color: 'white' }}>
        {'f(x)='}
      </TeX>
      <div className='box settingsButton'>
        <BsGearFill className='button' size={24} onClick={() => openSettings()} />
      </div>
    </div>
  );
};

export default MathInput;
