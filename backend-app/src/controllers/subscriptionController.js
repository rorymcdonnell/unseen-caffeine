import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);

// @desc    Get List of products from stripe
// @route   POST /api/subscription/products
// @access  Public
const getSubscriptionProducts = asyncHandler(async (req, res) => {
  const prices = await stripe.prices.list({
    limit: 100,
    active: true,
  });
  const products = await stripe.products.list({
    limit: 100,
    active: true,
  });

  let productsList = [];
  var combined = prices?.data.reduce((hash, obj) => {
    return (
      obj.product in hash
        ? hash[obj.product].push(obj)
        : (hash[obj.product] = [obj]),
      hash
    );
  }, Object.create(null));

  for (let product of products?.data) {
    product.price = combined[product.id];
    productsList.push(product);
  }
  res.json({ products: productsList });
});

const getUserSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({
    user: req.user._id,
  }).populate("user", "id name");
  res.json({ subscriptions });
});

const createUserSubscription = asyncHandler(async (req, res) => {
  const {
    customer: customerPayload,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isSaveForLater,
    isPreviousCard,
    customerId,
    subscriptionItem,
  } = req.body;
  try {
    if (isPreviousCard && customerId) {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        metadata: { blendType: req.body.blendType },
        items: [
          {
            price: subscriptionItem.stripePriceId,
          },
        ],
      });

      if (subscription) {
        subscriptionItem.stripeSubscriptionId = subscription.id;
        subscriptionItem.stripeSubscription = subscription;
        const order = new Subscription({
          user: req.user._id,
          shippingAddress,
          paymentMethod: "card",
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          isPaid: true,
          paidAt: Date.now(),
          isSubscription: true,
          subscriptionItem,
        });
        const createdOrder = await order.save();
        let user = await User.findById(req.user._id);
        user.subscriptions.push({
          stripeSubscriptionId: subscription.id,
          stripeProductId: subscriptionItem.stripePriceId,
        });
        await user.save();
        res.status(201).json(createdOrder);
      }
    } else {
      const customer = await stripe.customers.create(customerPayload);
      if (customer) {
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          metadata: { blendType: req.body.blendType },
          items: [
            {
              price: subscriptionItem.stripePriceId,
            },
          ],
        });
        if (subscription) {
          subscriptionItem.stripeSubscriptionId = subscription.id;
          subscriptionItem.stripeSubscription = subscription;
          const order = new Subscription({
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: true,
            paidAt: Date.now(),
            isSubscription: true,
            subscriptionItem,
          });
          await order.save();
          let user = await User.findById(req.user._id);
          user.subscriptions.push({
            stripeSubscriptionId: subscription.id,
            stripeProductId: subscriptionItem.stripePriceId,
          });
          if (isSaveForLater) {
            const userCardDetails = {
              card_id: customer.default_source,
              customer_id: customer.id,
              brand: req.body.card.brand,
              last4: req.body.card.last4,
              expiry: req.body.card.expiry,
            };
            user.savedCards.push(userCardDetails);
          }
          await user.save();
          res.status(201).json(order);
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

const cancelUserSubscription = asyncHandler(async (req, res) => {
  try {
    const deleted = await stripe.subscriptions.del(req.params.subscriptionId);
    if (deleted) {
      await Subscription.deleteOne({
        _id: req.params.id,
      });
    }
    res.json({ message: "Subscription Cancelled Successfully!" });
  } catch (error) {
    console.log("error", error.message);
  }
});

const getSubscriptionById = asyncHandler(async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    res.json({ subscription });
  } catch (error) {
    console.log("error lol");
  }
});

const updateSubscription = asyncHandler(async (req, res) => {
  if (req.body.billingCycleAnchor === "now") {
    req.body.prorationBehavior = "create_prorations";
  }
  if (req.body.billingCycleAnchor === "pause") {
    req.body.billingCycleAnchor = "unchanged";
    req.body.pause_collection = {
      behavior: "mark_uncollectible",
    };
    req.body.isPause = true;
  }

  if (req.body.billingCycleAnchor === "unpause") {
    req.body.billingCycleAnchor = "unchanged";
    req.body.pause_collection = {
      behavior: "",
    };
    req.body.isPause = false;
  }

  console.log(req.body);
  try {
    const subscription = await stripe.subscriptions.update(req.params.id, {
      items: req.body.items,
      metadata: { blendType: req.body.blendType },
      billing_cycle_anchor: req.body.billingCycleAnchor || "unchanged",
      pause_collection: req.body.pause_collection,
    });
    if (subscription) {
      let sub = await Subscription.findById(req.body.id);
      sub.subscriptionItem.stripeSubscription = subscription;
      sub.isPause = req.body.isPause || false;
      await sub.save();
      res.json({
        message: "Subscription Updated Successfully",
        subscription: sub,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export {
  getSubscriptionProducts,
  createUserSubscription,
  getUserSubscriptions,
  cancelUserSubscription,
  getSubscriptionById,
  updateSubscription,
};
