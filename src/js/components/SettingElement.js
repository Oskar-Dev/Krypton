import React from 'react';
import Dropdown from './Dropdown';

import '../../styles/Settings.css';

const SettingsElement = ({ label, description, type, data, selectedItem, onChange }) => {
  const selectElements = {
    dropdown: <Dropdown data={data} selectedItem={selectedItem} onChange={onChange} />,
    input: <input spellCheck={false} value={selectedItem} onChange={(e) => onChange(e.target.value)} />,
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
