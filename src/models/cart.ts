import { ObjectType, Field, ID } from "type-graphql";
import {
  prop as Property,
  getModelForClass,
  modelOptions as ModelOptions,
  Severity,
} from "@typegoose/typegoose";
import { Item } from "@models";

@ObjectType({ description: "The  Cart model" })
@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Cart {
  @Field(() => ID)
  id!: string;

  @Field((_type) => [Item])
  @Property()
  items!: Item[];

  @Field()
  @Property()
  total_quantity!: number;

  @Field()
  @Property()
  total_price!: number;
}

export const CartModel = getModelForClass(Cart);
export const cartModel = { id: "CART", model: CartModel };
