import React, { useEffect, useState } from 'react';
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from 'react-icons/vsc';
import '../../scss/Titlebar.scss';

const Titlebar = () => {
  const [isMaximized, setIsMaximized] = useState(true);
  const iconSize = 16;

  useEffect(() => {
    window.api.receive('windowMaximized', () => {
      setIsMaximized(true);
    });
    window.api.receive('windowRestored', () => {
      setIsMaximized(false);
    });
  }, []);

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

  return (
    <div className='titlebarContainer'>
      <div className='titlebarLeft'></div>

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
