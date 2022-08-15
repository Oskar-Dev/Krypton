import React from 'react';
import '../../scss/AddButton.scss';
import { MdAdd } from 'react-icons/md';

const AddButton = ({ callback }) => {
  return (
    <div className='addButton'>
      <MdAdd size={36} onClick={() => callback()} />
    </div>
  );
};

export default AddButton;
