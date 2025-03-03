import React from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200 ${positionClasses[position]}`}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
