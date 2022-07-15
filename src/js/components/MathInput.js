import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { replaceAll } from '../../utils/replaceAll';
import { BsGearFill, BsGear } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import { toGraph } from '../../utils/toGraph';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill.min.js');

import '../../mathquill-0.10.1/mathquill.css';
import './MathInput.scss';
import GraphSettings from './GraphSettings';

const MathInput = ({ callback, deleteCallback, index, expression, rerenderCounter }) => {
  const [mouseOverSettingsButton, setMouseOverSettingsButton] = useState(false);
  const [focus, setFocus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  var { settings } = toGraph[index];

  const id = `mathField${index}`;

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const closeSettingsOnBlur = () => {
    if (!mouseOverSettingsButton) toggleSettings();
  };

  const handleSettingsChange = (settings_) => {
    // var MQ = MathQuill.getInterface(2);
    // var mathFieldSpan = document.getElementById(id);
    // var mathField = MQ.MathField(mathFieldSpan);
    // var latex = mathField.latex();
    // setSettings(settings_);
    // callback(latex, index, settings_);
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

          callback(latex, index);
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
        <BsGear
          className='icon'
          color={settings.color}
          size={24}
          onClick={() => {
            toggleSettings();
          }}
          onMouseEnter={() => setMouseOverSettingsButton(true)}
          onMouseLeave={() => setMouseOverSettingsButton(false)}
        />
        <BsGearFill className='iconFill' color={settings.color + '3C'} size={24} />
      </div>

      {showSettings ? (
        <GraphSettings
          tabIndex={0}
          blurCallback={closeSettingsOnBlur}
          settingsCallback={handleSettingsChange}
          index={index}
        />
      ) : null}
    </div>
  );
};

export default MathInput;
