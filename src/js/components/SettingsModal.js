import React, { useState } from 'react';
import ReactDom from 'react-dom';
import SettingsPageButton from './SettingsPageButton';
import SettingsElement from './SettingElement';
import { settings } from '../../utils/globalSettings';

import { BsGearFill, BsGrid } from 'react-icons/bs';
import { TbAxisX, TbAxisY, TbBrackets } from 'react-icons/tb';

import '../../styles/Settings.css';
import '../../styles/globals.css';
import { clamp } from '../../utils/Maths';

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

const SettingsModal = ({ open, handleClose, applyThemeAndFontSettings, rerenderGraphs }) => {
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
            applyThemeAndFontSettings();
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
            applyThemeAndFontSettings();
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
            settings.axisX.showPositiveHalfAxisNumbers = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Zakończ Oś Strzałką'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisX.endAxisWithArrow}
          onChange={(value) => {
            settings.axisX.endAxisWithArrow = value;
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
          label='Automatyczna Odległość Między Liczbami'
          description='Odległość między liczbami na osi będzie się automatycznie dostosowywała do przybliżenia'
          type='switch'
          selectedItem={settings.axisX.autoNumbersDistance}
          onChange={(value) => {
            settings.axisX.autoNumbersDistance = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Odległość Między Liczbami'
          description='Liczby na osi są wyświelnane z dokładnością do maksymalnie jednego miejsca po przecinku'
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
    axisY: (
      <>
        <SettingsElement
          label='Pokaż Ujemną Półoś'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisY.showNegativeHalfAxis}
          onChange={(value) => {
            settings.axisY.showNegativeHalfAxis = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Dodatnią Półoś'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisY.showPositiveHalfAxis}
          onChange={(value) => {
            settings.axisY.showPositiveHalfAxis = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Liczny Na Ujemnej Półosi'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisY.showNegativeHalfAxisNumbers}
          onChange={(value) => {
            settings.axisY.showNegativeHalfAxisNumbers = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Liczny Na Dodatniej Półosi'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisY.showPositiveHalfAxisNumbers}
          onChange={(value) => {
            settings.axisY.showPositiveHalfAxisNumbers = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Zakończ Oś Strzałką'
          description=''
          type='switch'
          data=''
          selectedItem={settings.axisY.endAxisWithArrow}
          onChange={(value) => {
            settings.axisY.endAxisWithArrow = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Nazwa Osi'
          description=''
          type='input'
          maxInputLength={10}
          data=''
          selectedItem={settings.axisY.label}
          onChange={(value) => {
            settings.axisY.label = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Automatyczna Odległość Między Liczbami'
          description='Odległość między liczbami na osi będzie się automatycznie dostosowywała do przybliżenia'
          type='switch'
          selectedItem={settings.axisY.autoNumbersDistance}
          onChange={(value) => {
            settings.axisY.autoNumbersDistance = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Odległość Między Liczbami'
          description='Liczby na osi są wyświelnane z dokładnością do maksymalnie jednego miejsca po przecinku'
          type='input'
          maxInputLength={10}
          data=''
          selectedItem={settings.axisY.numbersDistance}
          onChange={(value) => {
            settings.axisY.numbersDistance = value;
            updateSettings();
          }}
        />
      </>
    ),
    grid: (
      <>
        <SettingsElement
          label='Pokaż Siatkę'
          description=''
          type='switch'
          selectedItem={settings.grid.show}
          onChange={(value) => {
            settings.grid.show = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Pokaż Drobną Siatkę'
          description=''
          type='switch'
          selectedItem={settings.grid.showSmallGrid}
          onChange={(value) => {
            settings.grid.showSmallGrid = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Automatyczna Szerokość Siatki'
          description='Szerokość głównej siatki będzie się automatycznie dostosowywała do przybliżenia'
          type='switch'
          selectedItem={settings.grid.autoWidth}
          onChange={(value) => {
            settings.grid.autoWidth = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Szerokość Siatki'
          description='Określa szerokość głównej siatki'
          type='input'
          maxInputLength={10}
          data=''
          selectedItem={settings.grid.width}
          onChange={(value) => {
            settings.grid.width = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Automatyczna Wysokość Siatki'
          description='Wysokość głównej siatki będzie się automatycznie dostosowywała do przybliżenia'
          type='switch'
          selectedItem={settings.grid.autoHeight}
          onChange={(value) => {
            settings.grid.autoHeight = value;
            updateSettings();
          }}
        />
        <SettingsElement
          label='Wysokość Siatki'
          description='Określa wysokość głównej siatki'
          type='input'
          maxInputLength={10}
          data=''
          selectedItem={settings.grid.height}
          onChange={(value) => {
            settings.grid.height = value;
            updateSettings();
          }}
        />
      </>
    ),
    advanced: (
      <>
        <SettingsElement
          label='Jakość Wykresów'
          description='Im mniejsza podana wartość tym większa jakość wykresów. Minimalna wartość to 0,01 a maksymalna to 1. Może mocno wpłynąć na wydajność'
          type='input'
          maxInputLength={10}
          selectedItem={settings.advanced.graphQuality}
          onChange={(value) => {
            settings.advanced.graphQuality = value;
            updateSettings();
            rerenderGraphs();
          }}
        />
        <SettingsElement
          label='Dokładny Pierwszy i Ostani Punkt'
          description='Włącza dokładniejsze liczenie pierwszego oraz ostaniego punktu co może poprawić dokładność wykresu oraz w niektórych przypadkach pogorszyć wydajność'
          type='switch'
          selectedItem={settings.advanced.preciseFirstAndLastPoints}
          onChange={(value) => {
            settings.advanced.preciseFirstAndLastPoints = value;
            updateSettings();
            rerenderGraphs();
          }}
        />
      </>
    ),
  };

  const updateSettings = () => {
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

            <SettingsPageButton
              value='advanced'
              label='Zaawansowane'
              icon={<TbBrackets className='icon' size={20} />}
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
