import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

@ObjectType({ description: "The  Item model" })
export class Item {
  @Field(() => ID)
  id!: string;
  
  @Field()
  @Property()
  item_sku!: string;

  @Field()
  @Property()
  count!: number;
}

export const ItemModel = getModelForClass(Item);
export const itemModel = { id: "ITEM", model: ItemModel };
