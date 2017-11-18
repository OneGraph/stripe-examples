import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if (window.location.pathname.indexOf('/oauth/stripe/finish') === 0) {
  try {
    window.opener.postMessage({type: 'auth/finish'}, window.opener.location);
  } catch (e) {
    console.error('postMessage', e);
  }
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
