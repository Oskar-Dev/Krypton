import React from 'react';
import ReactDom from 'react-dom';

import '../../styles/SettingsModal.css';

const SettingsModal = ({ open, handleClose }) => {
  const handleSettingPageChange = (clickedElement) => {
    const elements = document.getElementsByClassName('settingPageButton');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.classList.remove('selectedSettingPage');
    }

    clickedElement.classList.add('selectedSettingPage');
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
              onClick={(event) => handleSettingPageChange(event.target)}
            >
              <p>Ogólne</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target)}>
              <p>Wygląd</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target)}>
              <p>Osie</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target)}>
              <p>Siatka</p>
            </div>

            <div className='settingPageButton' onClick={(event) => handleSettingPageChange(event.target)}>
              <p>Wykres</p>
            </div>
          </div>
        </div>
        <div className='settingsModalRight'></div>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default SettingsModal;
