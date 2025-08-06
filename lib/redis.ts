import Redis from "ioredis";

let redis: Redis;

if (process.env.REDIS_URL) {
  // This is the production environment on Vercel
  redis = new Redis(process.env.REDIS_URL);
} else {
  // This is the local development environment
  // It will connect to localhost:6379
  redis = new Redis();
}

export default redis;
