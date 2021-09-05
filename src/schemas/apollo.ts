import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Product, Cart } from "@resolvers";
import { Container } from "typedi";

const schema = async () => {
  return await buildSchema({
    resolvers: [Product, Cart],
    emitSchemaFile: true,
    nullableByDefault: true,
    container: Container,
  });
};

export default schema;
