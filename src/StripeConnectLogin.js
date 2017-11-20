import React from 'react';
import Config from './Config';
import './css/stripe-connect.css';

const windowWidth = Math.min(800, Math.floor(window.outerWidth * 0.8));
const windowHeight = Math.min(630, Math.floor(window.outerHeight * 0.5));
const windowArea = {
  width: windowWidth,
  height: windowHeight,
  left: Math.round(window.screenX + (window.outerWidth - windowWidth) / 2),
  top: Math.round(window.screenY + (window.outerHeight - windowHeight) / 8),
};

// TODO: figure out how to show the toolbar icons in the window for password managers
const windowOpts = {
  width: windowArea.width,
  height: windowArea.height,
  left: windowArea.left,
  top: windowArea.top,
  toolbar: 0,
  scrollbars: 1,
  status: 1,
  resizable: 1,
  menuBar: 0,
};

const POLL_INTERVAL = 35;
const FINISH_PATH = 'oauth/stripe/finish';

class LoginButton extends React.Component {
  _authWindow;

  _waitForAuthFinish = () => {
    let intervalId;
    const clear = () => {
      clearInterval(intervalId);
      this._authWindow.close();
    };
    intervalId = setInterval(() => {
      try {
        const authLocation = this._authWindow.location;
        if (document.location.host === authLocation.host) {
          if (authLocation.pathname === '/' + FINISH_PATH) {
            clear();
            this.props.onAuthGranted();
          }
        }
      } catch (e) {
        console.error(e);
        clear();
      }
    }, POLL_INTERVAL);
  };

  _onAuthClick = () => {
    const authUrl = new URL('https://serve.onegraph.io');
    authUrl.pathname = '/oauth/start';
    authUrl.searchParams.set('service', 'stripe');
    authUrl.searchParams.set('app_id', Config.applicationId);
    authUrl.searchParams.set('path', FINISH_PATH);

    this._authWindow = window.open(
      authUrl,
      'oneGraphAuth',
      Object.keys(windowOpts)
        .map(k => `${k}=${windowOpts[k]}`)
        .join(','),
    );
    this._waitForAuthFinish();
  };

  render() {
    return (
      <button className="stripe-connect" onClick={this._onAuthClick}>
        <span>Connect with Stripe</span>
      </button>
    );
  }
}

export default LoginButton;
