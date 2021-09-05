import { connect, ConnectOptions } from "mongoose";

const startMongoose = async () => {
  try {
    const mongo = await connect(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    return await mongo.connection;
  } catch (e) {
    throw new Error("Mongoose Error");
  }
};

export default startMongoose;
