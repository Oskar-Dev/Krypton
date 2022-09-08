import { isArray, parse } from 'mathjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
  VscSettings,
  VscSaveAs,
} from 'react-icons/vsc';
import '../../styles/Titlebar.css';
import { toGraph } from '../../utils/toGraph';

const Titlebar = ({ handleSettingsButton, handleDomainButton, handleSetOfValuesButton, rerenderGraphs }) => {
  const saveLoadRef = useRef(null);
  const [saveLoadOpen, setSaveLoadOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(true);
  const iconSize = 16;
  const bigIconSize = 24;

  const handleSaveLoad = () => {
    setSaveLoadOpen((saveLoadOpen_) => !saveLoadOpen_);
  };

  const handleSaveLoadBlur = () => {
    setSaveLoadOpen(false);
  };

  const handleSave = () => {
    window.api.send('saveFile', JSON.stringify(toGraph));
  };

  const handleLoad = () => {
    window.api.send('openFile');
  };

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
    window.api.receive('loadedFile', (data) => {
      if (!data.loaded) return;
      var parsedData = JSON.parse(data.data);

      if (!isArray(parsedData)) return;

      toGraph.length = 0;
      toGraph.push(...parsedData);

      // get highest id
      var id = 0;
      for (var i = 0; i < toGraph.length; i++) if (toGraph[i].id > id) id = toGraph[i].id;

      console.log(id);

      rerenderGraphs(id);
    });
  }, []);

  useEffect(() => {
    if (saveLoadOpen) saveLoadRef.current.focus();
  }, [saveLoadOpen]);

  return (
    <div className='titlebarContainer'>
      <div className='titlebarLeft'>
        <div className='titlebarIconWrapper' onClick={handleSettingsButton}>
          <VscSettings className='titlebarIcon titlebarSettingsIcon' size={bigIconSize} />
        </div>

        <div className='noOutline' ref={saveLoadRef} tabIndex={0} onBlur={handleSaveLoadBlur}>
          <div className={`titlebarIconWrapper ${saveLoadOpen ? 'active' : ''}`} onMouseDown={handleSaveLoad}>
            <VscSaveAs className='titlebarIcon titlebarSettingsIcon' size={bigIconSize} />
          </div>

          {saveLoadOpen ? (
            <div className='saveLoadWrapper'>
              <p onClick={handleSave}>Zapisz</p>
              <p onClick={handleLoad}>Wczytaj</p>
            </div>
          ) : null}
        </div>

        <div className='titlebarIconWrapper' onClick={handleDomainButton}>
          <p className='titlebarUtilityButtonText'>D</p>
        </div>

        <div className='titlebarIconWrapper' onClick={handleSetOfValuesButton}>
          <p className='titlebarUtilityButtonText'>ZW</p>
        </div>
      </div>

      <div className='titlebarMiddle'>
        <p className='appTitle'>Krypton</p>
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
