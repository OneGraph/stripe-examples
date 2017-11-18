import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

// const query = gql`
//   query {
//     stripeCustomers {
//       edges {
//         node {
//           id
//           email
//           description
//         }
//       }
//     }
//   }
// `;

const query = gql`
  query {
    me {
      google {
        name
      }
      stripe {
        id
      }
    }
  }
`;

class StripeCustomers extends React.Component {
  render() {
    console.log('props', this.props);
    return <div>Stripe Customers</div>
  }
}

const StripeCustomersWithData = graphql(query)(StripeCustomers);
export default StripeCustomersWithData;
