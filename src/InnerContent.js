import React from 'react';

class InnerContent extends React.Component {
  render() {
    const Component = this.props.activePage.component;
    return (
      <div className="content-inner">
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">{this.props.activePage.title}</h2>
          </div>
        </header>
        <div style={{minHeight: '100vh'}}>
          <Component />
        </div>
      </div>
    );
  }
}

export default InnerContent;
