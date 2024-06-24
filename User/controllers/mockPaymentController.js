import nock from 'nock';

  // Mock payment functions
export const makeStripePayment = async (amount) => {
    // Simulate calling Stripe API
    const response = await nock('https://api.stripe.com')
      .post('/v1/charges', {
        amount,
        currency: 'usd',
        source: 'mock_source', // Mock payment source
      })
      .reply(200, {
        id: 'charge_id',
        amount,
        currency: 'usd',
        status: 'succeeded',
      });
    return response;
  };

  export const makePaypalPayment = async (amount) => {
    // Simulate calling PayPal API
    // Note: Replace the mock logic with PayPal API mock using nock
    const response = nock('https://api.stripe.com')
    .post('/v1/charges')
    .reply(200, {
      id: 'charge_id',
      amount: 2000,
      currency: 'usd',
      status: 'succeeded',
    });
    return response;
  };