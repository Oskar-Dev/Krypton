import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { BsGearFill, BsGear } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import { toGraph } from '../../utils/toGraph';

import $ from 'jquery';
window.jQuery = $;
require('../../mathquill-0.10.1/mathquill.min.js');

import '../../mathquill-0.10.1/mathquill.css';
import './MathInput.scss';
import GraphSettings from './GraphSettings';

const MathInput = ({ callback, deleteCallback, index, id, expression, rerenderCounter, renderGraphs, provided }) => {
  const [mouseOverSettingsButton, setMouseOverSettingsButton] = useState(false);
  const [focus, setFocus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rerender, setRerender] = useState(false);
  var { settings } = toGraph[index];

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const closeSettingsOnBlur = () => {
    if (!mouseOverSettingsButton) toggleSettings();
  };

  const forceRerender = () => {
    renderGraphs();
    setRerender(!rerender);
  };

  useEffect(() => {
    var MQ = MathQuill.getInterface(2);
    var mathFieldSpan = document.getElementById(id);
    var mathField = MQ.MathField(mathFieldSpan, {
      // spaceBehavesLikeTab: true, // configurable
      restrictMismatchedBrackets: true,
      charsThatBreakOutOfSupSub: '+-',
      autoCommands: 'pi phi sqrt',
      autoOperatorNames: 'sin cos tg tan ctg cot log ln abs',
      handlers: {
        edit: () => {
          var latex = mathField.latex();
          for (var i = 0; i < toGraph.length; i++) {
            if (toGraph[i].id === id) {
              callback(latex, i);
              break;
            }
          }
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

      <div className='box' {...provided.dragHandleProps}>
        <div className='settingsButton'>
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
      </div>

      {showSettings ? (
        <GraphSettings tabIndex={0} blurCallback={closeSettingsOnBlur} index={index} forceRerender={forceRerender} />
      ) : null}
    </div>
  );
};

export default MathInput;
