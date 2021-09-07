import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import expressPlayground from "graphql-playground-middleware-express";
import { Cart, Product } from "@resolvers";
import {
  MongoInitializer,
  ApolloInitializer,
  PushDemoData,
  RedisInitializer,
  DI,
} from "@initializers";
import { ApolloSchema } from "@schemas";
import cors from "cors";
import cookieParser from "cookie-parser";
import colors from "colors";
import { Container } from "typedi";
import { productModel, cartModel } from "@models";

const startServer = async () => {
  require("dotenv").config(__dirname + "../.local.env");
  const app = express();
  app.use(cors());
  app.use(cookieParser());

  const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");
  const REDIS_HOST = process.env.REDIS_HOST || "localhost";

  const redis = await RedisInitializer(REDIS_PORT, REDIS_HOST);
  await redis.flushall();

  const mongoConnection = await MongoInitializer();

  const models = [productModel, cartModel];
  const dependencyInjection = DI({ Container, models });

  const apolloServer = await ApolloInitializer(REDIS_PORT, REDIS_HOST);

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  //Uncomment this bloc to upload demo data to database
  /*const pushData = await PushDemoData();
  console.log(
    colors.yellow(`[App-Server] Are demo data pushed to database ? ${pushData}`)
  );*/

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: await ApolloSchema(),
      rootValue: { Cart, Product },
      context: () => {
        return { name: "test" };
      },
    })
  );

  app.get("/test-playground", expressPlayground({ endpoint: "/graphql" }));

  const PORT = process.env.PORT;

  app.use("/", (req, res) => {
    res.send(
      `Welcome to GraphQL server. Use GraphQL endpoint at http://localhost:${PORT}/test-playground`
    );
  });

  app.listen(PORT, () => {
    console.log(
      colors.blue(`[App-Server] Server is running on http://localhost:${PORT}`)
    );
    console.log(
      colors.magenta(
        `[App-Server] Graphql Palyground is running on http://localhost:${PORT}/test-playground`
      )
    );
  });
};

startServer();
