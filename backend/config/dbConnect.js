import mongoose from "mongoose";

export const connectDb = () => {
  try {
    let DB_URI = "";

    if (process.env.NODE_ENV === "DEVELOPMENT")
      DB_URI = process.env.DB_LOCAL_URI;
    if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

    mongoose.connect(DB_URI).then((con) => {
      console.log(`Database Connected: ${con?.connection?.host}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
