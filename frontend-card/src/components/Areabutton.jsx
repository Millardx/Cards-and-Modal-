import React from 'react';

const AreaButton = ({ label, onClick }) => {
  return (
    <button className="area-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default AreaButton;
