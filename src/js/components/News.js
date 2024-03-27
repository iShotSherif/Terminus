import React from 'react';
import HeaderComponent from './HeaderComponent';

const News = ({ isChildWindow: isChildWindowProp, onPopOut }) => {
  const isChildWindow = isChildWindowProp || window.ipcRenderer?.isChildWindow || false;

  const handlePopOutClick = () => {
    window.ipcRenderer.send('pop-out-news');
    onPopOut();
  };

  const handleCloseNewsClick = () => {
    if (isChildWindow) {
      window.ipcRenderer.send('reopen-news-in-main');
      window.close();
    } else {
      onPopOut && onPopOut();
    }
  };

  return (
    <div className="news-container">
      <HeaderComponent
        title="News"
        onPopOut={!isChildWindow ? handlePopOutClick : undefined}
        onClose={handleCloseNewsClick}
        isChildWindow={isChildWindow}
      />
    </div>
  );
};

export default News;
