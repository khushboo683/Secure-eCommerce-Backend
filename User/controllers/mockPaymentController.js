import nock from 'nock';
import {v4 as uuidv4} from 'uuid'
import axios from 'axios';
  // Mock payment functions
export const makeStripePayment = async (amount,currency) => {
    // Simulate calling Stripe API
    const chargeId = uuidv4();
    nock('https://api.stripe.com')
      .post('/v1/charges', {
        amount,
        currency
      })
      .reply(200, {
        id: chargeId,
        amount,
        currency: 'usd',
        status: 'succeeded',
      });

      const response = await axios.post('https://api.stripe.com/v1/charges', {amount, currency },{
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("response from strip", response.data)
    return response?.data;
  };

  export const makePaypalPayment = async (amount, currency) => {
    const chargeId = uuidv4();
    nock('https://api.paypal.com')
    .post('/v1/charges',{
        amount,
        currency
    })
    .reply(200, {
      id: chargeId,
      amount,
      currency: 'usd',
      status: 'succeeded',
    });
    const response = await axios.post('https://api.paypal.com', {amount, currency },{
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("response from strip", response.data)
    return response?.data;
  };