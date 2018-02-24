import React from 'react';
import './App.css';
import OneGraphClient from './OneGraphClient';
import {ApolloProvider} from 'react-apollo';
import Landing from './Landing';
import SideNavbar from './SideNavbar';
import InnerContent from './InnerContent';
import Config from './Config';
import OneGraphAuth from 'onegraph-auth';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

class App extends React.Component {
  state = {activePage: Config.pages[0], isLoggedIn: false, initializing: true};
  _oneGraphAuth = new OneGraphAuth({appId: Config.appId, service: 'stripe'});

  componentDidMount() {
    this._initialize();
  }

  _initialize = () => {
    this._oneGraphAuth
      .isLoggedIn()
      .then(isLoggedIn => this.setState({isLoggedIn, initializing: false}))
      .catch(error => {
        console.error('Error logging in', error);
        this.setState({initializing: false});
      });
  };

  _selectPage = activePage => {
    this.setState({activePage});
  };

  _handleAuthResponse = () => {
    this.setState({initializing: true});
    this._initialize();
  };

  _handleLogout = () => {
    this._oneGraphAuth.logout().then(() => this._initialize());
  };

  _innerContent = () => {
    const {activePage, initializing, isLoggedIn} = this.state;

    if (initializing) {
      return (
        <div style={styles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      );
    }
    if (!isLoggedIn) {
      return (
        <Landing
          oneGraphAuth={this._oneGraphAuth}
          onAuthResponse={this._handleAuthResponse}
        />
      );
    }
    return (
      <ApolloProvider client={OneGraphClient}>
        <div className="page-content d-flex align-items-stretch">
          <SideNavbar activePage={activePage} onSelectPage={this._selectPage} />
          <InnerContent activePage={activePage} />
        </div>
      </ApolloProvider>
    );
  };

  render() {
    return (
      <div className="page">
        <Header
          isLoggedIn={this.state.isLoggedIn}
          onLogout={this._handleLogout}
        />
        {this._innerContent()}
        <Footer />
      </div>
    );
  }
}

const styles = {
  spinnerContainer: {
    height: 'calc(100vh - 70px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
};

export default App;
