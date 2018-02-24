import React from 'react';

const Header = props => (
  <header className="header">
    <nav className="navbar">
      <div className="container-fluid" style={{display: 'flex'}}>
        <div className="navbar-header">
          <div className="navbar-brand">
            <div className="brand-text">
              Susan'{/*'*/}s Dispute<strong>Resolver</strong> for Stripe
            </div>
          </div>
        </div>
        {props.isLoggedIn ? (
          <button
            className="btn btn-link"
            style={{justifySelf: 'flex-end'}}
            onClick={props.onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  </header>
);

export default Header;
