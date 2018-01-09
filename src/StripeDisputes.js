import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import idx from 'idx';
import gravatar from 'gravatar';
import LoadingSpinner from './LoadingSpinner';
import {Button} from 'reactstrap';
import {StripeCustomer} from './StripeCustomers';

const PAGE_SIZE = 10;

const customerQuery = gql`
  query StripeCustomerQuery($customerId: String!) {
    stripe {
      customer(id: $customerId) {
        id
        email
        created
        accountBalance
        delinquent
        defaultSource
        livemode
        description
        charges {
          edges {
            node {
              amount
              status
              created
              dispute {
                status
                reason
              }
            }
          }
        }
        subscriptions {
          data {
            id
            status
            items {
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
        }
        discount {
          end
          subscription
        }
      }
    }
  }
`;

const query = gql`
  query recentDisputes($cursor: String) {
    stripe {
      disputes(after: $cursor) {
        edges {
          node {
            charge {
              source {
                customer {
                  id
                  email
                }
                last4
              }
            }
            created
            isChargeRefundable
            status
            reason
          }
          cursor
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
      }
    }
  }
`;

let stringOfStatus = status => {
  let r;
  switch (status) {
    case 'warning_needs_response':
      r = 'Warning(Needs response)';
      break;
    case 'warning_under_review':
      r = 'Warning (Under review)';
      break;
    case 'warning_closed':
      r = 'Warning (closed)';
      break;
    case 'needs_response':
      r = 'Needs (response)';
      break;
    case 'under_review':
      r = 'Under review';
      break;
    case 'charge_refunded':
      r = 'Charge refunded';
      break;
    case 'won':
      r = 'Won';
      break;
    case 'lost':
      r = 'Lost';
      break;
    default:
      r = status;
  }
  return r;
};

let stringOfReason = reason => {
  let r;
  switch (reason) {
    case 'duplicate':
      r = 'Duplicate';
      break;
    case 'fraudulent':
      r = 'Fraudulent';
      break;
    case 'subscription_canceled':
      r = 'Subscription Canceled';
      break;
    case 'product_unacceptable':
      r = 'Product Unacceptable';
      break;
    case 'product_not_received':
      r = 'Product Not Received';
      break;
    case 'unrecognized':
      r = 'Unrecognized';
      break;
    case 'credit_not_processed':
      r = 'Credit Not Processed';
      break;
    case 'general':
      r = 'General';
      break;
    case 'incorrect_account_details':
      r = 'Incorrect Account Details';
      break;
    case 'insufficient_funds':
      r = 'Insufficient Funds';
      break;
    case 'bank_cannot_process':
      r = 'Bank Cannot Process';
      break;
    case 'debit_not_authorized':
      r = 'Debit Not Authorized';
      break;
    case 'customer_initiated':
      r = 'Customer Initiated';
      break;
    default:
      r = reason;
  }
  return r;
};

class StripeCustomerWrapper extends React.Component {
  state = {loadingMore: false};

  render() {
    let content;
    if (this.props.data.loading) {
      content = <LoadingSpinner />;
    } else if (this.props.data.error) {
      // XXX: better errors
      content = <div>Error :( {this.props.data.error.message}</div>;
    } else {
      content = <StripeCustomer customer={this.props.data.stripe.customer} />;
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

const StripeCustomerWithData = graphql(customerQuery, {
  options: ({customerId}) => ({
    variables: {
      customerId,
    },
  }),
  props({data: {loading, stripe, fetchMore, variables}}) {
    return {
      data: {
        loading,
        stripe,
      },
    };
  },
})(StripeCustomerWrapper);

class StripeDispute extends React.Component {
  state = {open: false};
  handleToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState(oldState => {
      return {...oldState, open: !oldState.open};
    });
  }
  render() {
    const {dispute} = this.props;
    return (
      <div className="project">
        <div className="row bg-white has-shadow">
          <div className="left-col col-lg-6 d-flex align-items-center justify-content-between">
            <div className="project-title d-flex align-items-center">
              <div className="image has-shadow">
                <img
                  src={gravatar.url(dispute.charge.source.customer.email, {
                    d: 'retro',
                  })}
                  alt="dispute logo"
                  className="img-fluid "
                />
              </div>
              <div className="text">
                <h3 className="h4">{dispute.charge.source.customer.email}</h3>
                <small
                  style={{
                    textOverflow: 'ellipses',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
                  {dispute.isChargeRefundable ? (
                    <button>Refund</button>
                  ) : (
                    <button disabled={true}>Refund not possible</button>
                  )}
                </small>
                <button onClick={this.handleToggle.bind(this)}>+</button>
              </div>
            </div>
          </div>
          <div className="right-col col-lg-6 d-flex align-items-center">
            <div className="text">
              <div>Disputed {moment(dispute.created * 1000).fromNow()}</div>
              <div>
                {' '}
                {stringOfStatus(dispute.status)}
                {' - '}
                {stringOfReason(dispute.reason)}
              </div>
            </div>
          </div>
        </div>
        {!!this.state.open ? (
          <div className="row bg-white has-shadow">
            <div className="left-col col-lg-12 d-flex align-items-center justify-content-between">
              <StripeCustomerWithData
                customerId={dispute.charge.source.customer.id}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

class StripeDisputes extends React.Component {
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
    let didHappen;
    if (this.props.data.loading) {
      content = <LoadingSpinner />;
    } else if (this.props.data.error) {
      // XXX: better errors
      content = <div>Error :( {this.props.data.error.message}</div>;
      didHappen = false;
    } else {
      didHappen = true;
      content = [
        this.props.data.stripe.disputes.edges.map(s => {
          return <StripeDispute dispute={s.node} />;
        }),
      ];
      content = content.concat([
        this.props.data.stripe.disputes.pageInfo.hasNextPage ? (
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
    console.log('content:', content);
    return (
      <div className="page">
        <section>
          <div className="container-fluid">{content}</div>
        </section>
      </div>
    );
  }
}

const StripeDisputesWithData = graphql(query, {
  options: {variables: {limit: PAGE_SIZE, cursor: null}},
  props({data: {loading, stripe, fetchMore, variables}}) {
    return {
      data: {
        loading,

        stripe,
        loadMoreEntries: () => {
          const cursor = stripe.disputes.pageInfo.endCursor;
          return fetchMore({
            query,
            variables: {
              limit: PAGE_SIZE,
              cursor,
            },
            updateQuery: (previousResult, {fetchMoreResult, variables}) => {
              const newEdges = fetchMoreResult.stripe.disputes.edges;
              const lastEdge =
                previousResult.stripe.disputes.edges[
                  previousResult.stripe.disputes.edges.length - 1
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
                        ...fetchMoreResult.stripe.disputes,
                        edges: [
                          ...previousResult.stripe.disputes.edges,
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
})(StripeDisputes);

export default StripeDisputesWithData;

//   {
//   /*<StripeDispute customer={s.node} />; */
// }
