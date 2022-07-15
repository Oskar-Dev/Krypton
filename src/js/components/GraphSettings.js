import React, { useEffect, useRef } from 'react';
import './GraphSettings.scss';
import { MdClear } from 'react-icons/md';

const GraphSettings = ({ callback }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.focus();
  }, []);

  return (
    <div className='graphSettingsContainer' ref={containerRef} tabIndex={0} onBlur={() => callback()}>
      {/* <div className='titleContainer'>
        <p className='titleText'>Ustawienia Wykresu</p>

        <div className='icon closeIcon'>
          <MdClear size={32} />
        </div>
      </div>

      <div className='settingsContainer'>
        <div className='settingWrapper'>
          <p className='settingName'>Kolor</p>
          <div className='color'></div>
        </div>

        <div className='settingWrapper'>
          <p className='settingName'>Przezroczystość</p>
          <div className='color'></div>
        </div>

        <div className='settingWrapper'>
          <p className='settingName'>Grubość</p>
          <div className='color'></div>
        </div>
      </div> */}
      <p>test</p>
    </div>
  );
};

export default GraphSettings;
