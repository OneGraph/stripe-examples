import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
  query StripeCustomersQuery($cursor: String, $limit: Int) {
    stripeCustomers(after: $cursor, limit: $limit) {
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

class StripeCustomer extends React.Component {
  render() {
    const {customer} = this.props;
    return <div>{customer.description}</div>;
  }
}

class StripeCustomers extends React.Component {
  render() {
    console.log(this.props.data);
    if (this.props.data.loading) {
      return <div>Loading</div>;
    }
    if (this.props.data.error) {
      return <div>Error :( {this.props.data.error.message}</div>;
    }
    return (
      <div>
        <h1>Stripe Customers</h1>
        {this.props.data.stripeCustomers.edges.map(s => (
          <StripeCustomer key={s.node.id} customer={s.node} />
        ))}
        {this.props.data.stripeCustomers.pageInfo.hasNextPage ? (
          <button onClick={this.props.data.loadMoreEntries}>Load More</button>
        ) : null}
      </div>
    );
  }
}

const StripeCustomersWithData = graphql(query, {
  options: {variables: {limit: 2, cursor: null}},
  props({data: {loading, stripeCustomers, fetchMore, variables}}) {
    return {
      data: {
        loading,
        stripeCustomers,
        loadMoreEntries: () => {
          const cursor = stripeCustomers.pageInfo.endCursor;
          return fetchMore({
            query,
            variables: {
              limit: 2,
              cursor,
            },
            updateQuery: (previousResult, {fetchMoreResult, variables}) => {
              const newEdges = fetchMoreResult.stripeCustomers.edges;
              const pageInfo = fetchMoreResult.stripeCustomers.pageInfo;
              const lastEdge =
                previousResult.stripeCustomers.edges[
                  previousResult.stripeCustomers.edges.length - 1
                ];
              if (lastEdge.node.id !== cursor) {
                console.error(
                  'bad pagination query, throwing away results',
                  lastEdge.node.id,
                  cursor,
                );
                return previousResult;
              }
              return newEdges.length
                ? {
                    // Put the new comments at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    ...fetchMoreResult,
                    stripeCustomers: {
                      ...fetchMoreResult.stripeCustomers,
                      edges: [
                        ...previousResult.stripeCustomers.edges,
                        ...newEdges,
                      ],
                    },
                  }
                : previousResult;
            },
          });
        },
      },
    };
  },
})(StripeCustomers);

export default StripeCustomersWithData;
