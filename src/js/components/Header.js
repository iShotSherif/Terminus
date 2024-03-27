// Header.js
import React from 'react';
import Button from './Button';
import './styles/Header.css';

const Header = ({ toggleNews, toggleChart }) => {
  return (
    <header className="header-band">
      <Button onClick={toggleNews} className="headerButton" imgSrc="C:\Users\Paul Pruvot\OneDrive\Bureau\Retry\electron-react-boilerplate-master\images\icons8-news.svg" alt="News">
      </Button>
      <Button onClick={toggleChart} className="headerButton" imgSrc="C:\Users\Paul Pruvot\OneDrive\Bureau\Retry\electron-react-boilerplate-master\images\icons8-graphique-combiné-48.png" alt="Chart" />
    </header>
  );
};

export default Header;
