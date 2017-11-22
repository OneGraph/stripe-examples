import React from 'react';
import './App.css';
import OneGraphClient from './OneGraphClient';
import {ApolloProvider} from 'react-apollo';
import StripeLoginGuard from './StripeLoginGuard';
import SideNavbar from './SideNavbar';
import InnerContent from './InnerContent';
import Config from './Config';

class App extends React.Component {
  state = {activePage: Config.pages[0]};
  render() {
    return (
      <div className="page">
        <header className="header">
          <nav className="navbar">
            <div className="container-fluid">
              <div className="navbar-header">
                <div className="navbar-brand">
                  <div className="brand-text">
                    Stripe<strong>Dashboard</strong>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className="page-content d-flex align-items-stretch">
          <ApolloProvider client={OneGraphClient}>
            <StripeLoginGuard>
              <SideNavbar
                activePage={this.state.activePage}
                onSelectPage={activePage => this.setState({activePage})}
              />
              <InnerContent activePage={this.state.activePage} />
            </StripeLoginGuard>
          </ApolloProvider>
        </div>
      </div>
    );
  }
}

export default App;
