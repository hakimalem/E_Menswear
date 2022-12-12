import express, { urlencoded } from "express";
import data from "./data/data.js";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoute.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/build/index.html")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

// fetch single product :
app.get("/api/products/slug/:slug", (req, res) => {
  const { slug } = req.params;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }
  res.status(200).json(product);
});
// fetch single product :
app.get("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const product = data.products.find((p) => p._id === Number(id));
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
