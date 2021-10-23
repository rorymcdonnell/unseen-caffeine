import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51GrlswKxgG6DBpvV8x8MWFkHIHv2yaDR0WczGMqzKRFZ5hH4TEPgUAQR1eDEWNysZMsCPUh6mWdEVkg5CxOI7GkD00Tnee3aAA"
);

const StripeContainer = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeContainer;
