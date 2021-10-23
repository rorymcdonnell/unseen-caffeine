import Stripe from "stripe";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    customer: customerPayload,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isSaveForLater,
    isPreviousCard,
    customerId,
  } = req.body;
  try {
    if (isPreviousCard && customerId) {
      const payment = await stripe.paymentIntents.create({
        amount: parseInt(totalPrice * 100, 10),
        currency: "GBP",
        customer: customerId,
        description: "Unseen caffeine",
        payment_method_types: ["card"],
        payment_method: paymentMethod.token,
        confirm: true,
      });

      if (payment) {
        if (orderItems && orderItems.length === 0) {
          res.status(400);
          throw new Error("No order items");
        } else {
          const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: true,
            paidAt: Date.now(),
          });
          const createdOrder = await order.save();
          res.status(201).json(createdOrder);
        }
      }
    } else {
      const customer = await stripe.customers.create(customerPayload);
      if (customer) {
        const card = await stripe.customers.createSource(customer.id, {
          source: paymentMethod,
        });
        if (card) {
          const payment = await stripe.paymentIntents.create({
            amount: parseInt(totalPrice * 100, 10),
            currency: "GBP",
            customer: customer.id,
            description: "Unseen caffeine",
            payment_method_types: ["card"],
            payment_method: card.id,
            confirm: true,
          });
          if (payment) {
            if (orderItems && orderItems.length === 0) {
              res.status(400);
              throw new Error("No order items");
            } else {
              const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid: true,
                paidAt: Date.now(),
              });
              const createdOrder = await order.save();
              if (isSaveForLater) {
                let user = await User.findById(req.user._id);
                const userCardDetails = {
                  card_id: card.id,
                  customer_id: customer.id,
                  brand: card.brand,
                  last4: card.last4,
                  expiry: `${card.exp_month}/${card.exp_year}`,
                };
                user.savedCards.push(userCardDetails);
                await user.save();
              }
              res.status(201).json(createdOrder);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("Error", error.message);
    res.json({
      message: "Payment failed, Please try again",
      success: false,
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
