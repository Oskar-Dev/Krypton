import React, { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import '../../styles/Dropdown.css';

const Dropdown = ({ data, selectedItem, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open) dropdownRef.current.focus();
  }, [open]);

  return (
    <div
      className={`dropdownMain ${open ? 'dropdownOpen' : ''}`}
      ref={dropdownRef}
      tabIndex={0}
      onClick={() => setOpen(!open)}
      onBlur={() => setOpen(false)}
    >
      <h4>{selectedItem.label}</h4>
      <MdKeyboardArrowDown className='dropdownArrow' size={30} />

      {open ? (
        <div className='dropdownMenu'>
          {data.map((item) => {
            return (
              <div className='dropdownItem' key={item.value} onClick={() => onChange(item.value)}>
                <p>{item.label}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
