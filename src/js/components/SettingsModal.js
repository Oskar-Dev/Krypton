import React, { useState } from 'react';
import ReactDom from 'react-dom';
import SettingsPageButton from './SettingsPageButton';
import SettingsElement from './SettingElement';
import { settings } from '../../utils/globalSettings';

import { BsGearFill, BsGrid } from 'react-icons/bs';
import { TbAxisX, TbAxisY } from 'react-icons/tb';

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
          onChange={(value) => {
            settings.general.theme = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Rozmiar Tekstu'
          description=''
          type='dropdown'
          data={textSizeData}
          selectedItem={textSizeData.filter((obj) => obj.value === settings.general.textSize)[0]}
          onChange={(value) => {
            settings.general.textSize = value;
            updateSettings();
          }}
        />
      </>
    ),

    axisX: (
      <>
        <SettingsElement
          label='Pokaż Ujemną Półoś'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisX.showNegativeHalfAxis}
          onChange={(value) => {
            console.log(value);
            settings.axisX.showNegativeHalfAxis = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Dodatnią Półoś'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisX.showPositiveHalfAxis}
          onChange={(value) => {
            console.log(value);
            settings.axisX.showPositiveHalfAxis = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Liczny Na Ujemnej Półosi'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisX.showNegativeHalfAxisNumbers}
          onChange={(value) => {
            console.log(value);
            settings.axisX.showNegativeHalfAxisNumbers = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Liczny Na Dodatniej Półosi'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisX.showPositiveHalfAxisNumbers}
          onChange={(value) => {
            console.log(value);
            settings.axisX.showPositiveHalfAxisNumbers = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Nazwa Osi'
          description=''
          type='input'
          maxInputLength={10}
          data=''
          selectedItem={settings.axisX.label}
          onChange={(value) => {
            settings.axisX.label = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Odległość Między Liczbami'
          description='Liczby na osi są wyświelnane z dokładnością do jednego miejsca po przecinku'
          type='input'
          maxInputLength={10}
          data=''
          selectedItem={settings.axisX.numbersDistance}
          onChange={(value) => {
            settings.axisX.numbersDistance = value;
            updateSettings();
          }}
        />
      </>
    ),
    axisY: null,
    grid: null,
  };

  const updateSettings = () => {
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
              value='axisX'
              label='Oś Odciętych'
              icon={<TbAxisX className='icon' size={20} />}
              handlePageChange={handlePageChange}
              selectedPage={selectedPage}
            />

            <SettingsPageButton
              value='axisY'
              label='Oś Rzędnych'
              icon={<TbAxisY className='icon' size={20} />}
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
