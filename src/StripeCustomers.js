import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import idx from 'idx';
import gravatar from 'gravatar';
import LoadingSpinner from './LoadingSpinner';
import {Button} from 'reactstrap';

const PAGE_SIZE = 10;

const query = gql`
  query StripeCustomersQuery($cursor: String, $limit: Int) {
    stripe {
      customers(after: $cursor, limit: $limit) {
        edges {
          node {
            id
            email
            created
            accountBalance
            delinquent
            defaultSource
            livemode
            description
            subscriptions {
              data {
                id
                status
                items {
                  totalCount
                  data {
                    id
                    plan {
                      id
                      name
                      currency
                    }
                  }
                }
              }
              totalCount
            }
            discount {
              end
              subscription
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

class StripeCustomer extends React.Component {
  render() {
    const {customer} = this.props;
    const subscription = idx(customer, _ => _.subscriptions.data[0]);
    const plan = idx(subscription, _ => _.items.data[0].plan);
    return (
      <div className="project">
        <div className="row bg-white has-shadow">
          <div className="left-col col-lg-6 d-flex align-items-center justify-content-between">
            <div className="project-title d-flex align-items-center">
              <div className="image has-shadow">
                <img
                  src={gravatar.url(customer.email, {d: 'retro'})}
                  alt="customer logo"
                  className="img-fluid "
                />
              </div>
              <div className="text">
                <h3 className="h4">{customer.email}</h3>
                <small
                  style={{
                    textOverflow: 'ellipses',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
                  {customer.description}
                </small>
              </div>
            </div>
          </div>
          <div className="right-col col-lg-6 d-flex align-items-center">
            <div className="text">
              <div>Created {moment(customer.created * 1000).fromNow()}</div>
              <div>
                {' '}
                {!plan
                  ? 'No plan'
                  : plan.name + ' plan (' + subscription.status + ')'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class StripeCustomers extends React.Component {
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
      content = [
        this.props.data.stripe.customers.edges.map(s => (
          <StripeCustomer key={s.node.id} customer={s.node} />
        )),
      ].concat([
        this.props.data.stripe.customers.pageInfo.hasNextPage ? (
          this.state.loadingMore ? (
            <LoadingSpinner />
          ) : (
            <Button
              color="info"
              onClick={this._loadMore}
              disabled={this.state.loadingMore}>
              Load More
            </Button>
          )
        ) : null,
      ]);
    }
    return (
      <div className="page">
        <section>
          <div className="container-fluid">{content}</div>
        </section>
      </div>
    );
  }
}

const StripeCustomersWithData = graphql(query, {
  options: {variables: {limit: PAGE_SIZE, cursor: null}},
  props({data: {loading, stripe, fetchMore, variables}}) {
    return {
      data: {
        loading,

        stripe,
        loadMoreEntries: () => {
          const cursor = stripe.customers.pageInfo.endCursor;
          return fetchMore({
            query,
            variables: {
              limit: PAGE_SIZE,
              cursor,
            },
            updateQuery: (previousResult, {fetchMoreResult, variables}) => {
              const newEdges = fetchMoreResult.stripe.customers.edges;
              const lastEdge =
                previousResult.stripe.customers.edges[
                  previousResult.stripe.customers.edges.length - 1
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
                    stripe: {
                      customers: {
                        ...fetchMoreResult.stripe.customers,
                        edges: [
                          ...previousResult.stripe.customers.edges,
                          ...newEdges,
                        ],
                      },
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
