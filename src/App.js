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
                    Susan'{/*'*/}s Dispute<strong>Resolver</strong> for Stripe
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

        <footer className="footer main-footer">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <p>OneGraph © 2018</p>
              </div>
              <div className="col-sm-6 text-right">
                <p>
                  Design by{' '}
                  <a
                    href="https://bootstrapious.com/admin-templates"
                    className="external">
                    Bootstrapious
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;

<footer className="main-footer">
  <div className="container-fluid">
    <div className="row">
      <div className="col-sm-6">
        <p>Your company © 2017-2019</p>
      </div>
      <div className="col-sm-6 text-right">
        <p>
          Design by{' '}
          <a
            href="https://bootstrapious.com/admin-templates"
            className="external">
            Bootstrapious
          </a>
        </p>
      </div>
    </div>
  </div>
</footer>;
