import { ObjectType, Field, ID, Int } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { __Type } from "graphql";

@ObjectType({ description: "The Product model" })
export class Product {
  @Field(() => ID)
  id!: String;

  @Field()
  @Property()
  name!: String;

  @Field()
  @Property()
  sku!: String;

  @Field()
  @Property()
  description!: String;

  @Field()
  @Property()
  image!: String;

  @Field((_type) => Int)
  @Property()
  qty!: number;

  @Field((_type) => Int)
  @Property()
  price!: number;

}

export const ProductModel = getModelForClass(Product);
export const productModel = {id: 'PRODUCT',model: ProductModel};
