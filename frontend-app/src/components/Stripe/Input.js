import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
const StripeInput = () => {
  return (
    <>
      <div
        style={{
          background: "#FFF",
          paddingLeft: "10px",
          boxShadow: "2px 2px 5px #888888",
        }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
    </>
  );
};

export default StripeInput;
