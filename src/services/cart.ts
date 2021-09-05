import "reflect-metadata";
import { Service, Inject } from "typedi";
import { Cart, CartModel, Item, ProductModel } from "@models";
import { ObjectId } from "mongodb";

@Service("CartService")
export default class CartService {
  constructor(
    @Inject("CART") private readonly cart: typeof CartModel,
    @Inject("PRODUCT") private readonly product: typeof ProductModel
  ) {}

  async getAllCarts() {
    return this.cart.find();
  }
  async getCartById(id: string): Promise<Cart | null> {
    return this.cart.findOne({ _id: id });
  }
  async createEmptyCart(): Promise<Cart | null> {
    const emptyCart = await this.cart.create({
      id: "",
      items: [],
      total_quantity: 0,
      total_price: 0,
    });
    const res = await emptyCart.save();
    return res;
  }
  async addProductToCart(id: string, product_id: string): Promise<Cart | null> {
    const product = await this.product.findOne({ _id: product_id });

    const intermidateCart = await this.cart.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: { items: { item_sku: product?.sku, count: product?.stock } },
      },
      { upsert: true, new: true }
    );

    console.log(product?.sku)

    const cart = await this.cart.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          "items.$[elem].count": product?.stock,
          total_quantity: 1,
          total_price: product?.price || 0,
        },
      },
      {
        arrayFilters: [{ "elem.item_sku": product?.sku }],
        multi: true,
        new: true,
        upsert: true
      }
    );
    console.log(cart);
    return cart;
  }
  async deleteProductFromCart(
    id: string,
    product_id: string
  ): Promise<Cart | null> {
    const product = await this.product.findOne({ _id: product_id });

    const cart = await this.cart.findOneAndUpdate(
      { _id: id },
      {
        $inc: { total_quantity: -1, total_price: -(product?.price || 0) },
        $pull: { items: product?._id },
      },
      { multi: true }
    );
    return cart;
  }
}
