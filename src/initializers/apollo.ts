import { ApolloServer } from "apollo-server-express";
import { ApolloSchema } from "@schemas";

const startApolloGraphQl = async () => {
  return new ApolloServer({
    schema: await ApolloSchema(),
    context: ({ req, res }) => ({ req, res }),
    formatResponse: (response) => {
      return { ...response };
    },
  });
};

export default startApolloGraphQl;
