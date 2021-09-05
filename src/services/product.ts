import "reflect-metadata";
import { Service, Inject } from "typedi";
import { Product, ProductModel } from "@models";

@Service("ProductService")
export default class ProductService {
  constructor(
    @Inject("PRODUCT") private readonly product: typeof ProductModel
  ) {}

  async getAllProducts() {
    return this.product.find();
  }
  async getProductById(id: string): Promise<Product | null> {
    return this.product.findOne({ _id: id });
  }
}
