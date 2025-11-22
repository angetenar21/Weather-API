import redis from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl);

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redis.on("connect", () => {
  console.log("Connected to Redis server");
});

export default redis;