import React from 'react';

import '../../styles/Settings.css';

const SettingsPageButton = ({ value, label, handlePageChange, selectedPage }) => {
  return (
    <div
      className={`settingPageButton ${selectedPage === value ? 'selectedSettingPage' : ''}`}
      onClick={(event) => handlePageChange(value)}
    >
      <p>{label}</p>
    </div>
  );
};

export default SettingsPageButton;
