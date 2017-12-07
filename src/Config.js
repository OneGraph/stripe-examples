import StripeCustomers from './StripeCustomers';
import StripeCharges from './StripeCharges';

const pages = [
  {id: 'customers', title: 'Customers', component: StripeCustomers},
  {id: 'charges', title: 'Charges', component: StripeCharges},
];

const DEV = process.env.NODE_ENV === 'development';

const config = {
  applicationId: DEV
    ? '135be0f7-becf-46fe-8a82-bf572606b468'
    : '22de62ff-4c25-49a2-b06c-fbe355aec76a',
  authToken: DEV
    ? '65b25367-8f55-43b2-9ce5-72b4c3014b43'
    : '687b9599-781f-4dc7-9025-7246b9a02953',
  oneGraphUrl: 'https://serve.onegraph.com/dynamic',
  pages,
};

export default config;
