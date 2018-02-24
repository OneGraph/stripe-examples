import React from 'react';
import OneGraphStripeConnect from 'onegraph-stripe-connect';
import Config from './Config';
import {Row, Col, Jumbotron} from 'reactstrap';

class Landing extends React.Component {
  render() {
    return (
      <Row style={{flexGrow: '1', paddingTop: '45px'}}>
        <a
          href="https://github.com/OneGraph/stripe-examples"
          style={{zIndex: '999'}}>
          <img
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              border: '0',
            }}
            src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
            alt="Fork OneGraph Stripe-Examples on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
          />
        </a>
        <Col
          lg={2}
          style={{minHeight: '550px'}}
          id="force-height"
          className="d-xs-none"
        />
        <Col
          xs={12}
          md={10}
          lg={5}
          className="justify-content-center align-self-center">
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
                appId={Config.appId}
                oneGraphAuth={this.props.oneGraphAuth}
                onAuthResponse={this.props.onAuthResponse}
              />
            </p>
          </Jumbotron>
        </Col>
        <Col md={1} lg={1} style={{}} />
        <Col
          xs={12}
          md={12}
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
                Sign up »
              </a>
            </p>
          </Jumbotron>
        </Col>
        <Col lg={1} style={{}} />
      </Row>
    );
  }
}

export default Landing;
