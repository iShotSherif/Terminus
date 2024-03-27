import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import News from './components/News';
import Chart from './components/Chart'; // Ensure this import is correct based on your file structure

const queryParams = new URLSearchParams(window.location.search);
const isChildWindow = queryParams.get('child') === 'true';
const childType = queryParams.get('type'); // This could be 'news' or 'chart'

if (isChildWindow) {
    switch (childType) {
        case 'news':
            ReactDOM.render(<News isChildWindow={true} toggleNews={() => {}} />, document.getElementById('root'));
            break;
        case 'chart':
            ReactDOM.render(<Chart isChildWindow={true} />, document.getElementById('root')); // Assuming Chart doesn't need toggleChart prop, adjust if necessary
            break;
        default:
            // This could be an error page or any default child component you wish to render
            console.error('Unknown child window type');
    }
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
