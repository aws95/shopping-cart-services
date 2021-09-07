import { ApolloServer } from "apollo-server-express";
import { ApolloSchema } from "@schemas";
import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";
import { ApolloServerPluginCacheControl } from "apollo-server-core";

const startApolloGraphQl = async (REDIS_PORT: number, REDIS_HOST: string) => {
  return new ApolloServer({
    schema: await ApolloSchema(),
    context: ({ req, res }) => ({ req, res }),
    formatResponse: (response) => {
      return { ...response };
    },
    cache: new BaseRedisCache({
      client: new Redis({
        port: REDIS_PORT,
        host: REDIS_HOST,
      }),
    }),
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: 5000,
      }),
    ],
  });
};

export default startApolloGraphQl;
