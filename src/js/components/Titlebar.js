import React, { useEffect, useState } from 'react';
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose, VscSettings } from 'react-icons/vsc';
import '../../styles/Titlebar.css';

const Titlebar = ({ handleSettingsButton, handleDomainButton, handleValuesSetButton, onClick }) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const iconSize = 16;
  const settingsIconSize = 24;

  const handleMinimize = () => {
    window.api.send('minimize');
  };

  const handleMaximizeRestore = () => {
    if (isMaximized) window.api.send('restore');
    else window.api.send('maximize');
  };

  const handleClose = () => {
    window.api.send('close');
  };

  useEffect(() => {
    window.api.receive('windowMaximized', () => {
      setIsMaximized(true);
    });
    window.api.receive('windowRestored', () => {
      setIsMaximized(false);
    });
  }, []);

  return (
    <div className='titlebarContainer'>
      <div className='titlebarLeft'>
        <div className='titlebarIconWrapper' onClick={handleSettingsButton}>
          <VscSettings className='titlebarIcon titlebarSettingsIcon' size={settingsIconSize} />
        </div>

        <div className='titlebarIconWrapper' onClick={handleDomainButton}>
          <p className='titlebarUtilityButtonText'>D</p>
        </div>

        <div className='titlebarIconWrapper' onClick={handleValuesSetButton}>
          <p className='titlebarUtilityButtonText'>ZW</p>
        </div>
      </div>

      <div className='titlebarMiddle'>
        <p className='appTitle'>Jakaś Fajna Nazwa</p>
      </div>

      <div className='titlebarRight'>
        <div className='titlebarIconWrapper' onClick={handleMinimize}>
          <VscChromeMinimize className='titlebarIcon' size={iconSize} />
        </div>

        <div className='titlebarIconWrapper' onClick={handleMaximizeRestore}>
          {isMaximized ? (
            <VscChromeRestore className='titlebarIcon' size={iconSize} />
          ) : (
            <VscChromeMaximize className='titlebarIcon' size={iconSize} />
          )}
        </div>

        <div className='titlebarIconWrapper closeIconWrapper' onClick={handleClose}>
          <VscChromeClose className='titlebarIcon' size={iconSize} />
        </div>
      </div>
    </div>
  );
};

export default Titlebar;
