import express from "express";
import dotenv from "dotenv";
import errorMiddleWare from "./middleware/error.js";
import cookieParser from "cookie-parser";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down server due to uncaughtException");
  process.exit();
});

dotenv.config({ path: "backend/config/config.env" });
const app = express();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

//DB Connection
import { connectDb } from "./config/dbConnect.js";
connectDb();

// Import all routes
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", orderRoute);
app.use("/api", paymentRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `App running on port ${process.env.PORT} and in ${process.env.NODE_ENV}`
  );
});

app.use(errorMiddleWare);

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down server due to unhandledRejection");
  server.close(() => {
    process.exit();
  });
});
