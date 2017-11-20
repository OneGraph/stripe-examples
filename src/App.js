import React from 'react';
import './App.css';
import OneGraphClient from './OneGraphClient';
import {ApolloProvider} from 'react-apollo';
import StripeCustomers from './StripeCustomers';
import StripeLoginGuard from './StripeLoginGuard';
import SideNavbar from './SideNavbar';
import InnerContent from './InnerContent';

class App extends React.Component {
  render() {
    return (
      <div className="page">
        <header class="header">
          <nav class="navbar">
            <div class="container-fluid">
              <div class="navbar-header">
                <div class="navbar-brand">
                  <div class="brand-text">
                    Stripe<strong>Dashboard</strong>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div class="page-content d-flex align-items-stretch">
          <ApolloProvider client={OneGraphClient}>
            <StripeLoginGuard>
              <SideNavbar />
              <InnerContent />
            </StripeLoginGuard>
          </ApolloProvider>
        </div>
      </div>
    );
  }
}

export default App;
