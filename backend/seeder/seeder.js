import mongoose from "mongoose";
import Product from "../models/productModel.js";
import products from "./data.js";

const seeder = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/shopvy");
    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("Products inserted");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seeder();
