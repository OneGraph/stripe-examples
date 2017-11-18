import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
  query StripeCustomersQuery($cursor: String) {
    stripeCustomers(after: $cursor) {
      edges {
        node {
          id
          email
          description
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

class StripeCustomers extends React.Component {
  render() {
    console.log(this.props.data);
    return <div>Stripe Customers</div>
  }
}

const StripeCustomersWithData = graphql(query)(StripeCustomers);
export default StripeCustomersWithData;
