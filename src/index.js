import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './css/style.default.css';
/* import 'bootstrap/dist/css/bootstrap-theme.css'; */

if (window.location.pathname.indexOf('/oauth/stripe/finish') !== 0) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
