import OneGraphApolloClient from 'onegraph-apollo-client';

import Config from './Config';

const client = new OneGraphApolloClient({
  applicationId: Config.applicationId,
});

export default client;
