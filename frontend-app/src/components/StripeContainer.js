import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentScreen from "../screens/PaymentScreen";
// import PlaceOrderScreen from "../screens/PlaceOrderScreen";

const PUBLIC_KEY =
  "pk_test_51GrlswKxgG6DBpvV8x8MWFkHIHv2yaDR0WczGMqzKRFZ5hH4TEPgUAQR1eDEWNysZMsCPUh6mWdEVkg5CxOI7GkD00Tnee3aAA";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentScreen />
      {/* <PlaceOrderScreen /> */}
    </Elements>
  );
};

export default StripeContainer;
