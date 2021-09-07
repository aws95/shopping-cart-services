import "reflect-metadata";
import { Service, Inject } from "typedi";
import { Cart, CartModel, ProductModel } from "@models";

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
    const found = await this.cart.find({ _id: id });
    const cartItems = found[0].items;
    let cart: Cart;
    if (cartItems.filter((item) => item.item_sku === product?.sku).length > 0) {
      cart = await this.cart.findOneAndUpdate(
        { _id: id },
        {
          $inc: {
            "items.$[elem].count": product?.qty,
            total_quantity: 1,
            total_price: product?.price || 0,
          },
        },
        {
          arrayFilters: [{ "elem.item_sku": product?.sku }],
          multi: true,
          new: true,
          upsert: true,
        }
      );
    } else {
      cart = await this.cart.findOneAndUpdate(
        { _id: id },
        {
          $addToSet: {
            items: { item_sku: product?.sku, count: product?.qty },
          },
          $inc: {
            total_quantity: 1,
            total_price: product?.price || 0,
          },
        },
        { upsert: true, new: true }
      );
    }

    return cart;
  }
  async deleteProductFromCart(
    id: string,
    product_id: string
  ): Promise<Cart | null> {
    const product = await this.product.findOne({ _id: product_id });
    const found = await this.cart.find({ _id: id });
    const cartItem = found[0].items.filter(
      (item) => item.item_sku === product?.sku
    )[0];

    const cart = await this.cart.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          total_quantity: -cartItem.count,
          total_price: -(cartItem.count * (product?.price || 1) || 0),
        },
        $pull: { items: { item_sku: product?.sku } },
      },
      { new: true, multi: true }
    );
    return cart;
  }
  async decrementProductFromCart(
    id: string,
    product_id: string
  ): Promise<Cart | null> {
    const product = await this.product.findOne({ _id: product_id });
    const found = await this.cart.find({ _id: id });
    const cartItem = found[0].items.filter(
      (item) => item.item_sku === product?.sku
    )[0];
    if (cartItem.count <= 1) {
      return found[0];
    }
    const cart = await this.cart.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          "items.$[elem].count": -1,
          total_quantity: -1,
          total_price: -(product?.price || 0),
        },
      },
      {
        arrayFilters: [{ "elem.item_sku": product?.sku }],
        multi: true,
        new: true,
        upsert: true,
      }
    );
    return cart;
  }
  async emptyCart(id: string): Promise<Cart | null> {
    const cart = await this.cart.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          total_quantity: 0,
          total_price: 0,
          items: [],
        },
      },
      { new: true, multi: true }
    );
    return cart;
  }
}
