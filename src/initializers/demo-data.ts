import {
  Product,
  Cart,
  CartModel,
  ProductModel,
  ItemModel,
  Item,
} from "@models";
import sample from "@sample";

const pushDemoData = async () => {
  let items: Item[] = [];
  let price: number = 0;
  for await (const elt of sample) {
    const product = new ProductModel({
      id: elt.id,
      name: elt.name,
      sku: elt.sku,
      description: elt.description,
      qty: elt.qty,
      price: elt.price,
      image: elt.image,
    } as Product);
    const savedProduct = await product.save();
    const item = new ItemModel({
      id: savedProduct.id,
      item_sku: savedProduct.sku,
      count: savedProduct.qty,
    } as Item);
    price += product.price;
    items.push(item);
  }
  const cart = new CartModel({
    id: "demo-id",
    items: items,
    total_quantity: items.length,
    total_price: parseFloat(price.toFixed(2)),
  } as Cart);
  const carts = await cart.save();

  return true;
};

export default pushDemoData;
