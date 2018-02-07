import OneGraphApolloClient from 'onegraph-apollo-client';

import Config from './Config';

const client = new OneGraphApolloClient({
  appId: Config.appId,
});

export default client;
