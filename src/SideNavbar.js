import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import LoadingSpinner from './LoadingSpinner';
import gravatar from 'gravatar';
import Config from './Config';

const query = gql`
  query StripeAccountQuery {
    me {
      stripe {
        id
        business_name
        business_logo
        business_url
        email
      }
    }
  }
`;

class SideNavbar extends React.Component {
  render() {
    if (this.props.data.loading) {
      return (
        <nav className="side-navbar">
          <div className="sidebar-header d-flex align-items-center">
            <LoadingSpinner />
          </div>
        </nav>
      );
    }
    if (this.props.data.error) {
      console.error(this.props.data.error);
      return `Error: ${this.props.data.error.message}`;
    }
    const account = this.props.data.me.stripe;
    const logoSrc =
      account.business_logo || gravatar.url(account.email, {d: 'retro'});
    return (
      <nav className="side-navbar">
        <div className="sidebar-header d-flex align-items-center">
          <div className="avatar">
            <img
              src={logoSrc}
              alt="business logo"
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="title">
            <h1 className="h4">{account.business_name}</h1>
            <p>{account.business_url}</p>
          </div>
        </div>
        <ul className="list-unstyled">
          {Config.pages.map(page => (
            <li
              className={page === this.props.activePage ? 'active' : ''}
              key={page.id}
            >
              <a
                href="/"
                onClick={e => {
                  e.preventDefault();
                  this.props.onSelectPage(page);
                }}
              >
                {page.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default graphql(query)(SideNavbar);
