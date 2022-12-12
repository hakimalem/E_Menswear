import express from 'express';
import Product from '../models/productModel.js';
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send({ products });
});

productRouter.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug });
  if (!product) {
    return res.status(404).send({ message: 'product not found' });
  }
  res.send(product);
});

productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404).send({ message: 'product not found' });
  }
  res.send(product);
});

export default productRouter;
