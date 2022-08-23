import React from 'react';
import '../../styles/Switch.css';

const Switch = ({ checked, onChange }) => {
  return (
    <div className='switchMain' switchChecked={checked.toString()} onClick={() => onChange(!checked)}>
      <div className='switchCircle' switchChecked={checked.toString()} />
    </div>
  );
};

export default Switch;
