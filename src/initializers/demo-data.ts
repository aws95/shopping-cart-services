import { Product, Cart, CartModel, ProductModel, ItemModel } from "@models";

const pushDemoData = async () => {
  const product = new ProductModel({
    id: "demo-id",
    name: "demo-name",
    sku: "demo-sku",
    description: "demo-description",
    stock: 1,
    price: 100,
  } as Product);
  const products = await product.save();

  const item = new ItemModel({
    id: "demo-id",
    item_sku: products.sku,
    count: products.stock,
  });

  const cart = new CartModel({
    id: "demo-id",
    items: [item],
    total_quantity: 1,
    total_price: 100,
  } as Cart);
  const carts = await cart.save();

  return true;
};

export default pushDemoData;
