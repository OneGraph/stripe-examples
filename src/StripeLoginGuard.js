import React from 'react';
import gql from 'graphql-tag';
import OneGraphStripeConnect from 'onegraph-stripe-connect';
import LoadingSpinner from './LoadingSpinner';
import Config from './Config';

import {graphql} from 'react-apollo';

const stripeLoggedInQuery = gql`
  query {
    me {
      stripe {
        id
      }
    }
  }
`;

class StripeLoginGuard extends React.Component {
  render() {
    const {data} = this.props;
    if (data.loading) {
      return (
        <div
          style={{
            height: 'calc(100vh - 70px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <LoadingSpinner />
        </div>
      );
    }
    if (data.error) {
      return `There was an error :( ${data.error.message}`;
    }
    const loggedIn = this.props.data.me && this.props.data.me.stripe;
    return loggedIn ? (
      this.props.children
    ) : (
      <OneGraphStripeConnect
        applicationId={Config.applicationId}
        onAuthGranted={() => {
          console.log('refetching');
          data.refetch();
        }}
      />
    );
  }
}

export default graphql(stripeLoggedInQuery)(StripeLoginGuard);
