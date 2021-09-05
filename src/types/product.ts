import { InputType, Field } from "type-graphql";
import { Product } from "@models";

@InputType()
export default class ProductInputs implements Partial<Product> {
  @Field()
  name!: String;

  @Field()
  sku!: String;

  @Field()
  description!: String;

  @Field()
  stock!: number;

  @Field()
  price!: number;
}
