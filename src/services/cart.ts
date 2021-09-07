import "reflect-metadata";
import { Service, Inject } from "typedi";
import { Cart, CartModel, ProductModel } from "@models";

@Service("CartService")
export default class CartService {
  constructor(
    @Inject("CART") private readonly cart: typeof CartModel,
    @Inject("PRODUCT") private readonly product: typeof ProductModel
  ) {}

  /**
   * Get all carts in database
   * @typeParam None
   * @param None
   * @returns an array of cart objects
   */
  async getAllCarts() {
    return this.cart.find();
  }

  /**
   * Get a cart from database by it's id from database
   * @typeParam string
   * @param id
   * @returns an array that contains 1 cart object if it exists
   */
  async getCartById(id: string): Promise<Cart | null> {
    return this.cart.findOne({ _id: id });
  }

  /**
   * Create an empty cart in database
   * @typeParam None
   * @param None
   * @returns an array with 1 empty cart object
   */
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

  /**
   * Add 1 product in existing cart in database and increment that product count by 1 if it already exists in database
   * @typeParam string
   * @param id
   * @typeParam string
   * @param product_id
   * @returns an array that contains 1 cart object
   */
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

  /**
   * Deletes 1 product in database
   * @typeParam string
   * @param id
   * @typeParam string
   * @param product_id
   * @returns an array that contains 1 cart object
   */
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

 /**
   * Decrement product count in cart by 1
   * @typeParam string
   * @param id
   * @typeParam string
   * @param product_id
   * @returns an array that contains 1 cart object
   */
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

  /**
   * Empty out a cart 
   * @typeParam string
   * @param id
   * @returns an array with 1 empty cart object
   */
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
