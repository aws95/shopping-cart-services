import * as Mongoose from "mongoose";
import { ICart } from "@interfaces";

export default interface ICartModel extends Mongoose.Model<ICart> {}
