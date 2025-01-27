import { mongoose } from 'mongoose';
import { DB_NAME } from "../constants.js"
import dotenv from 'dotenv';
dotenv.config(

);

const connectDB = async () => {
  try {

    // console.log(`${process.env.MONGODB_URI}`);

    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)

    console.log(`\nMongoDB connected! DB host : ${connectionInstance.connection.host}`);

  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
}


export default connectDB;