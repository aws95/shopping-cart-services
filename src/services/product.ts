import "reflect-metadata";
import { Service, Inject } from "typedi";
import { Product, ProductModel } from "@models";

@Service("ProductService")
export default class ProductService {
  constructor(
    @Inject("PRODUCT") private readonly product: typeof ProductModel
  ) {}

  /**
   * Get all products that exists in database
   * @typeParam None
   * @param None
   * @returns an array all the products that exist in database
   */
  async getAllProducts() {
    return this.product.find();
  }

  /**
   * Get 1 product from database by its id or sku
   * @typeParam string
   * @param id
   * @typeParam string
   * @param sku
   * @returns an array with 1 product object
   */
  async getProduct(id?: string, sku?: string): Promise<Product | null> {
    if (id !== "") {
      return this.product.findOne({ _id: id });
    }
    if (sku !== "") {
      return this.product.findOne({ sku: sku });
    }
    return null;
  }
}
