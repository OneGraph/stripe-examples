import React from 'react';
import Config from './Config';

const windowWidth = Math.min(1000, Math.floor(window.outerWidth * 0.8));
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

class LoginButton extends React.Component {
  _authWindow: ?window;

  _handleAuthMessage = (event: MessageEvent) => {
    if (event.origin === window.location.origin) {
      const {data} = event;
      if (data && typeof data === 'object') {
        if (data.type === 'auth/finish') {
          this._authWindow && this._authWindow.close();
          this.props.onAuthGranted();
        }
      }
    }
  };

  _onAuthClick = () => {
    const authUrl = new URL('https://serve.onegraph.io');
    authUrl.pathname = '/oauth/start';
    authUrl.searchParams.set('service', 'stripe');
    authUrl.searchParams.set('app_id', Config.applicationId);
    authUrl.searchParams.set('path', 'oauth/stripe/finish');

    this._authWindow = window.open(
      authUrl,
      'oneGraphAuth',
      Object.keys(windowOpts)
        .map(k => `${k}=${windowOpts[k]}`)
        .join(','),
    );
    window.addEventListener('message', this._handleAuthMessage);
  };

  render() {
    return (
      <div>
        <button
          style={{
            border: '1px solid lightgrey',
            outline: 'none',
            cursor: 'pointer',
            backgroundColor: 'lightblue',
            fontSize: 16,
            padding: '12px 18px',
            margin: '8px',
          }}
          onClick={this._onAuthClick}>
          Login with Stripe
        </button>
      </div>
    );
  }
}

export default LoginButton;
