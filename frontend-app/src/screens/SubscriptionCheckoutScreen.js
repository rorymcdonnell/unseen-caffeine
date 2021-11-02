import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";
import {
  createUserSubscription,
  openSubscriptionModal,
} from "../actions/subscriptionActions";
import { SUBSCRIPTION_CREATE_RESET } from "../constants/subscriptionConstants";

const SubscriptionCheckoutScreen = ({ history }) => {
  const { product } = history?.location?.state;
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 3.0);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const createSubscription = useSelector((state) => state.createSubscription);
  const { loading, loaded } = createSubscription;

  const blendType = JSON.parse(localStorage.getItem("blendType"));

  useEffect(() => {
    if (loaded) {
      history.push(`/profile/my-subscriptions`);
      dispatch(openSubscriptionModal(false));
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
      dispatch({ type: SUBSCRIPTION_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [history, loaded]);

  const placeOrderHandler = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const customer = {
      name: user.name,
      email: user.email,
      source: cart.paymentMethod.token,
    };
    const subscriptionItem = {
      stripeProductName: product.name,
      stripeProductId: product.id,
      stripePriceId: product?.price?.id,
      stripeProductShippingCharges: 3.0,
      stripeProductPrice: product?.price?.unit_amount / 100,
      stripeProductImageUrl: product?.image,
      price: product?.price,
      prices: product?.prices,
    };
    const payload = {
      customer,
      isSaveForLater: cart.paymentMethod.isSaveForLater,
      isPreviousCard: cart.paymentMethod.isPreviousCard,
      customerId: cart.paymentMethod.customerId,
      shippingAddress: cart.shippingAddress,
      itemsPrice: product?.price?.unit_amount / 100,
      paymentMethod: cart.paymentMethod.brand,
      shippingPrice: 3.0,
      subscriptionItem,
      blendType: blendType?.blendType,
      card: {
        brand: cart?.paymentMethod.brand,
        last4: cart?.paymentMethod.last4,
        expiry: cart?.paymentMethod?.expiry,
      },
    };

    dispatch(createUserSubscription(payload));
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping CheckOut</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>
                {cart?.paymentMethod?.brand} Card *******
                {cart?.paymentMethod?.last4}{" "}
              </strong>
              expires in {cart?.paymentMethod?.expiry}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={product?.image}
                        alt={product?.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col>
                      <b>{product?.name}</b>
                    </Col>
                    <Col md={4}>
                      1 x £{product?.price?.unit_amount / 100} = £
                      {(1 * product?.price?.unit_amount) / 100}
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>
                    £
                    {history?.location?.state?.product?.price?.unit_amount /
                      100 -
                      3.0}
                    .00
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>£3.00</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    £
                    {history?.location?.state?.product?.price?.unit_amount /
                      100}
                    .00
                  </Col>
                </Row>
              </ListGroup.Item>
              {/* <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item> */}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0 || loading}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
              {/* <ListGroup.Item>
                <StripeContainer />
              </ListGroup.Item> */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SubscriptionCheckoutScreen;
