import { InputType, Field, ID } from "type-graphql";
import { Cart, Item } from "@models";

@InputType()
export default class CartInputs implements Partial<Cart> {
  @Field(() => Item)
  items!: Item[];
}
