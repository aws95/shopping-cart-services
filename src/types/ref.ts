import { ObjectId } from "mongodb";

type Ref<T> = T | ObjectId;

export default Ref;
