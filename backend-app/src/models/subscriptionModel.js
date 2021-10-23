import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // orderItems: [
    //   {
    //     name: { type: String, required: true },
    //     qty: { type: Number, required: true },
    //     image: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     product: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //       ref: "Product",
    //     },
    //   },
    // ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    isSubscription: {
      type: Boolean,
      required: false,
      default: false,
    },

    isPause: {
      type: Boolean,
      required: false,
      default: false,
    },

    subscriptionItem: {
      stripeProductName: { type: String, required: true },
      stripeSubscriptionId: { type: String, required: true },
      stripeProductId: { type: String, required: true },
      stripeProductPrice: { type: Number, required: true },
      stripeProductShippingCharges: { type: Number, required: false },
      stripePriceId: { type: String, required: true },
      stripeProductImageUrl: { type: String, required: false },
      price: { type: Object, required: false },
      prices: { type: Array, required: false },
      stripeSubscription: { type: Object, required: false },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
