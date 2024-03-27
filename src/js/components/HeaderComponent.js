import React from 'react';
import './styles/HeaderComponent.css';

const HeaderComponent = ({ title, onPopOut, onClose, isChildWindow, searchTerm, onSearch, filteredCoins, onCoinSelect, showSearchResults }) => {
  
  const handleCoinSelect = (coin) => {
    onCoinSelect(coin);
  };

  return (
    <div className="header">
      <span className="title">{title}</span>
      <div className="no-drag search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={onSearch}
        />
        <div className="search-results" style={{ display: showSearchResults ? 'block' : 'none' }}>
          {filteredCoins?.length > 0 && filteredCoins.map((coin, index) => (
            <div key={index} className="coin-item" onClick={() => handleCoinSelect(coin)}>
              {coin.symbol}
            </div>
          ))}
        </div>
      </div>
      <div className="buttons">
        {!isChildWindow && onPopOut && (
          <button className="no-drag popout-button" onClick={onPopOut}>
            🗗
          </button>
        )}
        {onClose && (
          <button className="no-drag close-button" onClick={onClose}>
            ✖
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;