import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
const { shell } = window.require('electron');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

document.addEventListener('click', (event) => {
  // Open external links in the default browser.
  const target = event.target as any;
  if (target.tagName !== 'A' || !target.href.startsWith('http')) return;

  event.preventDefault();
  shell.openExternal(target.href);
})