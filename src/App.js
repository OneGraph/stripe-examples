import React from 'react';
import './App.css';
import OneGraphClient from './OneGraphClient';
import {ApolloProvider} from 'react-apollo';
import StripeCustomers from './StripeCustomers';
import StripeLoginGuard from './StripeLoginGuard';

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={OneGraphClient}>
        <StripeLoginGuard>
          <div className="App">
            <StripeCustomers />
          </div>
        </StripeLoginGuard>
      </ApolloProvider>
    );
  }
}

export default App;
