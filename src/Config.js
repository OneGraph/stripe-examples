import StripeCustomers from './StripeCustomers';
import StripeCharges from './StripeCharges';

const pages = [
  {id: 'customers', title: 'Customers', component: StripeCustomers},
  {id: 'charges', title: 'Charges', component: StripeCharges},
];

const config = {
  appId: '22de62ff-4c25-49a2-b06c-fbe355aec76a',
  pages,
};

export default config;
