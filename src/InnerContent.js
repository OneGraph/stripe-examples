import React from 'react';
import StripeCustomers from './StripeCustomers';

class InnerContent extends React.Component {
  render() {
    return (
      <div className="content-inner">
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Stripe Customers</h2>
          </div>
        </header>
        <StripeCustomers />
      </div>
    );
  }
}

export default InnerContent;
