import Redis from "ioredis";

const startRedisServer = (REDIS_PORT: number, REDIS_HOST: string) => {
  const redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
  });
  console.log(`[Redis-Server] Redis Server is running on port :${REDIS_PORT}`);
  return redis;
};

export default startRedisServer;
