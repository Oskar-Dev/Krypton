import React from 'react';
import '../../styles/AddButton.css';
import { MdAdd } from 'react-icons/md';

const AddButton = ({ callback }) => {
  return (
    <div className='addButton'>
      <MdAdd size={36} onClick={() => callback()} />
    </div>
  );
};

export default AddButton;
