import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import isAuth from '../utils.js';
const orderRouter = express.Router();

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      itemsPrice,
      taxPrice,
      totalPrice,
    } = req.body;
    const newOrder = new Order({
      orderItems: orderItems.map((p) => ({ ...p, product: p._id })),
      shippingAddress,
      paymentMethod,
      shippingPrice,
      itemsPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: 'new order created', order });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });

      return res.send(orders);

      //   res.send({ message: 'no orders' });
    } catch (error) {
      res.status(500).send(error);
    }
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).send({ message: 'order not found' });
      }
      res.status(200).send(order);
    } catch (error) {
      res.send({ message: error });
    }
  })
);

orderRouter.put(
  '/"id/pay',
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      return res.send({ message: 'Order send', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

export default orderRouter;
