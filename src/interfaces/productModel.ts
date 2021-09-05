import * as Mongoose from "mongoose";
import { IProduct } from "@interfaces";

export default interface IProductModel extends Mongoose.Model<IProduct> {}
