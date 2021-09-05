import "reflect-metadata";
import { Cart, Product } from "@models";
import { CartService } from "@services";
import { Resolver, Query, Arg, Ctx, Mutation } from "type-graphql";
import { Inject, Service } from "typedi";

@Service()
@Resolver()
export default class ProductResolver {
  constructor(
    @Inject("CartService") private readonly cartService: CartService
  ) {}

  @Query(() => [Cart])
  async carts() {
    return this.cartService.getAllCarts();
  }

  @Query(() => Cart)
  async cartByID(@Arg("id") id: string, @Ctx() ctx: any) {
    return this.cartService.getCartById(id);
  }

  @Mutation(() => Cart)
  async emptyCart() {
    return this.cartService.createEmptyCart();
  }

  @Mutation(() => Cart)
  async addProductToCart(
    @Arg("id") id: string,
    @Arg("product_id") product_id: string,
    @Ctx() ctx: any
  ) {
    return this.cartService.addProductToCart(id, product_id);
  }

  @Mutation(() => Cart)
  async deleteProductFromCart(
    @Arg("id") id: string,
    @Arg("product_id") product_id: string,
    @Ctx() ctx: any
  ) {
    return this.cartService.deleteProductFromCart(id, product_id);
  }
}
