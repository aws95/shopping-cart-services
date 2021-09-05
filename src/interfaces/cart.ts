import { Product } from "@types";

export default interface ICart {
  id: String;
  items: [Product];
  total_quantity: String;
  total_price: Number;
}
