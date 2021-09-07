import "reflect-metadata";
import { Product } from "@models";
import { ProductService } from "@services";
import { Resolver, Query, Arg, Ctx } from "type-graphql";
import { Inject, Service } from "typedi";

@Service()
@Resolver()
export default class ProductResolver {
  constructor(
    @Inject("ProductService") private readonly productService: ProductService
  ) {}

  @Query(() => [Product])
  async getProducts() {
    return this.productService.getAllProducts();
  }

  @Query(() => Product)
  async getProduct(@Arg("id") id: string = "", @Arg("sku") sku: string = "") {
    return this.productService.getProduct(id, sku);
  }
}
