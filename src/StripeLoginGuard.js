import React from 'react';
import gql from 'graphql-tag';
import StripeConnectLogin from './StripeConnectLogin';

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
    console.log(data);
    if (data.networkStatus === 1) {
      return <div>Loading...</div>;
    }
    if (data.error) {
      return <div>There was an error :( {data.error.message}</div>;
    }
    const loggedIn = this.props.data.me && this.props.data.me.stripe;
    return loggedIn ? (
      this.props.children
    ) : (
      <StripeConnectLogin
        onAuthGranted={() => {
          console.log('refetching');
          data.refetch();
        }}
      />
    );
  }
}

export default graphql(stripeLoggedInQuery)(StripeLoginGuard);
