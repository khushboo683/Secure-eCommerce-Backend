import { RateLimiterRedis } from 'rate-limiter-flexible';
import { opts } from '../config/redis.js';
const rateLimiter = new RateLimiterRedis(opts);

export const rateLimitMiddleware = (req, res, next) => { // Middleware function to apply rate limiting
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch((err) => {
        res.status(429).send('Too Many Requests');
      });
  };