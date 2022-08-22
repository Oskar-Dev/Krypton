import React, { useState } from 'react';
import ReactDom from 'react-dom';
import SettingsPageButton from './SettingsPageButton';
import SettingsElement from './SettingElement';
import { settings } from '../../utils/globalSettings';

import { BsGearFill, BsGrid } from 'react-icons/bs';
import { TbAxisX } from 'react-icons/tb';

import '../../styles/Settings.css';
import '../../styles/globals.css';

const themeData = [
  { label: 'Jasny', value: 'light' },
  { label: 'Ciemny', value: 'dark' },
  { label: 'Ocean', value: 'ocean' },
];

const textSizeData = [
  { label: 'Mały', value: 'small' },
  { label: 'Normalny', value: 'normal' },
  { label: 'Duży', value: 'large' },
];

const SettingsModal = ({ open, handleClose, applySettingsFunc }) => {
  const [selectedPage, setSelectedPage] = useState('general');
  const [forceRerender, setForceRerender] = useState(false);

  const pages = {
    general: (
      <>
        <SettingsElement
          label='Motyw'
          description=''
          type='dropdown'
          data={themeData}
          selectedItem={themeData.filter((obj) => obj.value === settings.general.theme)[0]}
          onChange={(value) => handleThemeChange(value)}
        />
        <SettingsElement
          label='Rozmiar Tekstu'
          description=''
          type='dropdown'
          data={textSizeData}
          selectedItem={textSizeData.filter((obj) => obj.value === settings.general.textSize)[0]}
          onChange={(value) => handleTextSizeChange(value)}
        />
      </>
    ),

    axis: null,
    grid: null,
  };

  const handleThemeChange = (value) => {
    settings.general.theme = value;
    applySettingsFunc();
    setForceRerender(!forceRerender);
  };

  const handleTextSizeChange = (value) => {
    settings.general.textSize = value;
    applySettingsFunc();
    setForceRerender(!forceRerender);
  };

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className='modalOverlay' onClick={handleClose} />
      <div className='modalContentWrapper'>
        <div className='settingsModalLeft'>
          <div className='settingsModalTopLeft'>
            <h2>Ustawienia</h2>
          </div>

          <div className='settingsModalBottomLeft'>
            <SettingsPageButton
              value='general'
              label='Ogólne'
              icon={<BsGearFill className='icon' size={20} />}
              handlePageChange={handlePageChange}
              selectedPage={selectedPage}
            />

            <SettingsPageButton
              value='axis'
              label='Osie'
              icon={<TbAxisX className='icon' size={20} />}
              handlePageChange={handlePageChange}
              selectedPage={selectedPage}
            />

            <SettingsPageButton
              value='grid'
              label='Siatka'
              icon={<BsGrid className='icon' size={20} />}
              handlePageChange={handlePageChange}
              selectedPage={selectedPage}
            />
          </div>
        </div>
        <div className='settingsModalRight'>{pages[selectedPage]}</div>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default SettingsModal;
