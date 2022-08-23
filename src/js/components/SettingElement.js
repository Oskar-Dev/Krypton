import React from 'react';
import Dropdown from './Dropdown';
import Switch from './Switch';

import '../../styles/Settings.css';

const SettingsElement = ({ label, description, type, data, selectedItem, onChange, maxInputLength }) => {
  const selectElements = {
    dropdown: <Dropdown data={data} selectedItem={selectedItem} onChange={onChange} />,
    input: (
      <input
        type='text'
        spellCheck={false}
        maxLength={maxInputLength}
        value={selectedItem}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    switch: <Switch checked={selectedItem} onChange={(value) => onChange(value)} />,
  };

  return (
    <div className='settingsElementWrapper'>
      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>

      {selectElements[type]}
    </div>
  );
};

export default SettingsElement;
