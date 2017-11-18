import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if (window.location.pathname.indexOf('/oauth/stripe/finish') !== 0) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
