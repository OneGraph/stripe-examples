import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import Config from './Config';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink({
    uri: Config.oneGraphUrl + '?application_id=' + Config.applicationId,
    headers: {
      'Content-Type': 'application/json',
      'auth-token': Config.authToken,
    },
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  dataIdFromObject: object => `${object.__typename}-${object.id}`,
});

export default client;
