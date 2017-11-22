import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import gravatar from 'gravatar';
import LoadingSpinner from './LoadingSpinner';
import {Button} from 'reactstrap';

const PAGE_SIZE = 10;

function formatStripeAmount(amount, currency) {
  const locale = new Intl.NumberFormat().resolvedOptions().locale;
  return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(
    amount / 100
  );
}

const query = gql`
  query StripeChargesQuery($cursor: String, $limit: Int) {
    stripeCharges(after: $cursor, limit: $limit) {
      edges {
        node {
          id
          created
          paid
          amount
          currency
          outcome {
            network_status
            reason
            risk_level
            rule
            seller_message
          }
          customer {
            email
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

class StripeCharges extends React.Component {
  state = {loadingMore: false};
  _loadMore = () => {
    this.setState({loadingMore: true});
    this.props.data
      .loadMoreEntries()
      .then(() => this.setState({loadingMore: false}))
      .catch(() => this.setState({loadingMore: false}));
  };

  render() {
    let content;
    if (this.props.data.loading) {
      content = <LoadingSpinner />;
    } else if (this.props.data.error) {
      // XXX: better errors
      content = <div>Error :( {this.props.data.error.message}</div>;
    } else {
      content = (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.props.data.stripeCharges.edges.map(({node}) => (
                <tr key={node.id}>
                  <td>
                    <img
                      alt="customer logo"
                      className="img-fluid rounded-circle"
                      style={{width: 24, height: 24, marginRight: 12}}
                      src={gravatar.url(node.customer.email, {d: 'retro'})}
                    />
                    {node.customer.email}
                  </td>
                  <td>{formatStripeAmount(node.amount, node.currency)}</td>
                  <td>{moment(node.created * 1000).fromNow()}</td>
                  <td>{node.paid ? 'paid' : 'outstanding'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {this.props.data.stripeCharges.pageInfo.hasNextPage ? (
            this.state.loadingMore ? (
              <LoadingSpinner />
            ) : (
              <Button
                color="info"
                onClick={this._loadMore}
                disabled={this.state.loadingMore}
              >
                Load More
              </Button>
            )
          ) : null}
        </div>
      );
    }
    return (
      <div className="page">
        <section>
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">{content}</div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const StripeChargesWithData = graphql(query, {
  options: {variables: {limit: PAGE_SIZE, cursor: null}},
  props({data: {loading, stripeCharges, fetchMore, variables}}) {
    return {
      data: {
        loading,
        stripeCharges,
        loadMoreEntries: () => {
          const cursor = stripeCharges.pageInfo.endCursor;
          return fetchMore({
            query,
            variables: {
              limit: PAGE_SIZE,
              cursor,
            },
            updateQuery: (previousResult, {fetchMoreResult, variables}) => {
              const newEdges = fetchMoreResult.stripeCharges.edges;
              const lastEdge =
                previousResult.stripeCharges.edges[
                  previousResult.stripeCharges.edges.length - 1
                ];
              if (lastEdge.node.id !== cursor) {
                console.error(
                  'bad pagination query, throwing away results',
                  lastEdge.node.id,
                  cursor
                );
                return previousResult;
              }
              return newEdges.length
                ? {
                    // Put the new comments at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    ...fetchMoreResult,
                    stripeCharges: {
                      ...fetchMoreResult.stripeCharges,
                      edges: [
                        ...previousResult.stripeCharges.edges,
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
})(StripeCharges);

export default StripeChargesWithData;
