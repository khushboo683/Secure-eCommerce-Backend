import  Redis from 'ioredis';
const redisClient = new Redis({ enableOfflineQueue: false });

export const opts = {
    storeClient: redisClient,
    points: 100, // 100 requests
    duration: 60, // per 60 seconds
  };


