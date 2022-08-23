import React from 'react';
import '../../styles/Switch.css';

const Switch = ({ checked, onChange }) => {
  return (
    <div className='switchMain' ischecked={checked.toString()} onClick={() => onChange(!checked)}>
      <div className='switchCircle' ischecked={checked.toString()} />
    </div>
  );
};

export default Switch;
