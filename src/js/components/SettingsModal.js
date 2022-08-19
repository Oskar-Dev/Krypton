import React, { useState } from 'react';
import ReactDom from 'react-dom';
import GeneralSettings from './GeneralSettings';

import '../../styles/Settings.css';

const SettingsModal = ({ open, handleClose }) => {
  const [selectedPage, setSelectedPage] = useState('general');

  const pages = {
    general: <GeneralSettings />,
    page0: null,
    page1: null,
    page2: null,
    page3: null,
  };

  const handleSettingPageChange = (clickedElement, page) => {
    const elements = document.getElementsByClassName('settingPageButton');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.classList.remove('selectedSettingPage');
    }

    clickedElement.classList.add('selectedSettingPage');

    setSelectedPage(page);
  };

  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className='modalOverlay' onClick={handleClose} />
      <div className='modalContentWrapper'>
        <div className='settingsModalLeft'>
          <div className='settingsModalTopLeft'>
            <p>Ustawienia</p>
          </div>

          <div className='settingsModalBottomLeft'>
            <div
              className='settingPageButton selectedSettingPage'
              onClick={(event) => handleSettingPageChange(event.target, 'general')}
            >
              <p>Ogólne</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target, 'page0')}>
              <p>Wygląd</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target, 'page1')}>
              <p>Osie</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target, 'page2')}>
              <p>Siatka</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target, 'page3')}>
              <p>Wykres</p>
            </div>
          </div>
        </div>
        <div className='settingsModalRight'>{pages[selectedPage]}</div>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default SettingsModal;
