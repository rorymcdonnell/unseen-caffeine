import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import StripeContainer from "../components/Stripe/Container";
import StripeInput from "../components/Stripe/Input";
import { getUserDetails } from "../actions/userActions";

const PaymentCollector = ({ history }) => {
  console.log(history.location.state);
  const stripe = useStripe();
  const elements = useElements();
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  const [isChecked, setIsChecked] = useState(false);
  const [isUseExistingCard, setIsUseExistingCard] = useState(false);
  const [cardError, setCardError] = useState("");
  const [selectedCard, setSelectedCard] = useState({});

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDetails(loggedUser._id));
  }, [loggedUser._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setCardError(result.error.message);
      return;
    } else {
      setCardError("");
      dispatch(
        savePaymentMethod({
          isSaveForLater: isChecked,
          token: result.token?.id,
          brand: result.token.card.brand,
          last4: result.token.card.last4,
          expiry: `${result.token.card.exp_month}/${result.token.card.exp_year}`,
        })
      );
      if (history?.location?.state?.type === "subscription") {
        history.push({ pathname: "/checkout", state: history.location.state });
      } else {
        history.push("/placeorder");
      }
    }
  };

  const handleSubmitWithSavedCard = () => {
    const payload = {
      isPreviousCard: true,
      customerId: selectedCard.customer_id,
      token: selectedCard.card_id,
      brand: selectedCard.brand,
      last4: selectedCard.last4,
      expiry: selectedCard.expiry,
    };
    dispatch(savePaymentMethod(payload));
    if (history?.location?.state?.type === "subscription") {
      history.push({ pathname: "/checkout", state: history.location.state });
    } else {
      history.push("/placeorder");
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="payment-screen-header">Payment Method</h1>

      {!isUseExistingCard && (
        <>
          <Form.Group>
            <Form.Label className="payment-screen-header" as="legend">
              Card Details
            </Form.Label>
            <StripeInput />

            {cardError && (
              <p className="mt-2 alert alert-danger">{cardError}</p>
            )}
          </Form.Group>
          <div className="form-group">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label
                className="text-white form-check-label"
                htmlFor="gridCheck"
              >
                Save this card for later use
              </label>
            </div>
          </div>
        </>
      )}

      {user?.savedCards && user?.savedCards?.length > 0 && (
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="savedCard"
              checked={isUseExistingCard}
              onChange={(e) => setIsUseExistingCard(e.target.checked)}
            />
            <label className="text-white form-check-label" htmlFor="savedCard">
              Use Saved Cards
            </label>
          </div>
        </div>
      )}

      {isUseExistingCard && (
        <ul className="list-group">
          {user?.savedCards?.map((card, index) => (
            <li
              className={
                selectedCard === card
                  ? "list-group-item mb-2 bg-primary"
                  : "list-group-item mb-2"
              }
              key={index}
            >
              <div className="d-flex align-items-center justify-content-between">
                <span>************{card.last4}</span>
                <span className="badge badge-primary">{card.brand}</span>
                <span>{card.expiry}</span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedCard(card)}
                >
                  Use
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {isUseExistingCard ? (
        <Button
          onClick={handleSubmitWithSavedCard}
          className="continue-btn"
          variant="primary"
        >
          Continue
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          className="continue-btn"
          variant="primary"
        >
          Continue
        </Button>
      )}
    </FormContainer>
  );
};
const PaymentScreen = ({ history }) => {
  // My attempt at integrating stripe
  // const stripe = useStripe();
  // const elements = useElements();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: elements.getElement(CardElement),
  //   });

  //   if (!error) {
  //     try {
  //       const { id } = paymentMethod;
  //       const response = await axios.post("http://localhost:3000/payment", {
  //         amount: 1000,
  //         id,
  //       });

  //       if (response.data.success) {
  //         console.log("Successful payment");
  //         setSuccess(true);
  //       }
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   } else {
  //     console.log(error.message);
  //   }
  // };

  // if (!shippingAddress.address) {
  //   history.push("/shipping");
  // }

  return (
    <StripeContainer>
      <PaymentCollector history={history} />
    </StripeContainer>
  );
};

export default PaymentScreen;
