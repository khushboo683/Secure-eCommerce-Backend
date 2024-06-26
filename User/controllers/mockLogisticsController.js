import nock from 'nock';
import {v4 as uuidv4} from 'uuid'
import axios from 'axios';

export const mockLogisticsProvider = async(shipmentDetails) => {
   const trackingId = uuidv4();
 
   nock('https://api.logisticsprovider.com')
     .post('/v1/shipment', {
       shipmentDetails
     })
     .reply(200, {
       trackingId,
       status: 'SHIPMENT_CREATED',
       estimatedDelivery: '2024-07-01',
     });
     const response = await axios.post('https://api.logisticsprovider.com/v1/shipment', shipmentDetails, {
      headers: { 'Content-Type': 'application/json' }
    });
  
    return response.data;
 };
 
 // Mocking a logistics provider API for delivery status check
export const mockDeliveryStatus = async (trackingId) => {
   nock('https://api.logisticsprovider.com')
     .get(`/v1/shipment/${trackingId}/status`)
     .reply(200, {
       trackingId,
       status: 'IN_TRANSIT',
       estimatedDelivery: '2024-07-01',
     });
     const response = await axios.get(`https://api.logisticsprovider.com/v1/shipment/${trackingId}/status`, {
      headers: { 'Content-Type': 'application/json' }
    });
  
    return response.data;
 };

