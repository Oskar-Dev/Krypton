import React from 'react';

import '../../styles/Settings.css';

const SettingsPageButton = ({ value, label, handlePageChange, selectedPage, icon }) => {
  return (
    <div
      className={`settingPageButton ${selectedPage === value ? 'selectedSettingPage' : ''}`}
      onClick={(event) => handlePageChange(value)}
    >
      {icon}
      <p>{label}</p>
    </div>
  );
};

export default SettingsPageButton;
