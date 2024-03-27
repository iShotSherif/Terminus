// Button.js
import React from 'react';

const Button = ({ onClick, children, imgSrc, alt }) => {
  return (
    <button onClick={onClick}>
      {imgSrc && <img src={imgSrc} alt={alt || 'Button image'} style={{ marginRight: children ? '10px' : '0', verticalAlign: 'middle' }} />}
      {children}
    </button>
  );
};

export default Button;
