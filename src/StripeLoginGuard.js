import React from 'react';
import gql from 'graphql-tag';
import OneGraphStripeConnect from 'onegraph-stripe-connect';
import LoadingSpinner from './LoadingSpinner';
import Config from './Config';
import {Row, Col, Jumbotron} from 'reactstrap';

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
      <Row style={{flexGrow: '1', paddingTop: '45px'}}>
        <Col lg={2} style={{}} />
        <Col lg={5} style={{}}>
          <Jumbotron>
            <h1 className="display-4">Hello, world!</h1>
            <p className="lead">
              This demo app shows how easy{' '}
              <a href="https://www.onegraph.com">OneGraph</a> makes it to pull
              in your data from services like Stripe via GraphQL. It'{/*'*/}s{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/onegraph/stripe-examples">
                just some HTML and JavaScript
              </a>!
            </p>
            <hr className="my-4" />
            <p>Login to try it out with your Stripe data!</p>
            <p className="lead">
              <OneGraphStripeConnect
                applicationId={Config.applicationId}
                onAuthGranted={() => {
                  data.refetch();
                }}
              />
            </p>
          </Jumbotron>
        </Col>
        <Col lg={1} style={{}} />
        <Col
          lg={3}
          style={{}}
          className="justify-content-center align-self-center">
          <Jumbotron>
            <h2 style={{display: 'inline-block'}}>OneGraph</h2>, the single
            GraphQL endpoint for all your most important SaaS APIs
            <p />
            <p>Ready to build your own apps and tools with OneGraph?</p>
            <p className="lead">
              <a
                className="btn btn-primary btn-lg"
                href="https://www.onegraph.com/"
                role="button">
                Sign up for OneGraph »
              </a>
            </p>
          </Jumbotron>
        </Col>
        <Col lg={1} style={{}} />
      </Row>
    );
  }
}

export default graphql(stripeLoggedInQuery)(StripeLoginGuard);
