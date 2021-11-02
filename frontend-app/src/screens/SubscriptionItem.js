import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserSubscriptionItemById,
  updateUserSubscription,
} from "../actions/subscriptionActions";
import { Button, Row, Col } from "react-bootstrap";
import "../subscription.css";
import ConfirmationModal from "../components/ConfirmationModal";

const blendTypes = [
  { id: 1, name: "Espresso" },
  { id: 2, name: "Filter" },
  { id: 3, name: "Cafetiere" },
  { id: 4, name: "Wholebean" },
];

const SubscriptionItem = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingAnchor, setBillingAnchor] = useState(false);

  const [blendType, setBlendType] = useState("Wholebean");
  const [quantity, setQuantity] = useState(0);
  const [packSize, setPackSize] = useState("");

  useEffect(() => {
    dispatch(getUserSubscriptionItemById(params?.id));
  }, [dispatch, getUserSubscriptionItemById]);

  const { subscription, loading } = useSelector(
    (state) => state.getSubscriptionItem
  );

  const { updating, updateSuccessMessage } = useSelector(
    (state) => state.updateUserSubscription
  );

  useEffect(() => {
    if (subscription) {
      setQuantity(subscription?.subscriptionItem?.stripeSubscription?.quantity);
      setPackSize({
        id: subscription?.subscriptionItem?.stripeSubscription?.plan?.id,
        amount:
          subscription?.subscriptionItem?.stripeSubscription?.plan?.amount /
          100,
      });
      setBlendType(
        subscription?.subscriptionItem?.stripeSubscription?.metadata?.blendType
      );
    }
    // if (subscription?.isPause) {
    //   window.location = "/profile/my-subscriptions";
    // }
  }, [subscription]);

  if (loading) {
    return <p>loading...</p>;
  }

  const handleSubmit = (billingCycle) => {
    const plan =
      subscription?.subscriptionItem?.stripeSubscription?.items?.data[0]?.id;
    const price = subscription?.subscriptionItem?.stripeSubscription?.plan?.id;
    const items = [
      {
        id: plan,
        quantity: parseInt(quantity),
        deleted: packSize?.id !== price ? true : false,
      },
    ];
    if (packSize?.id !== price) {
      items.push({ price: packSize?.id, quantity: parseInt(quantity) });
    }
    const payload = {
      id: params?.id,
      blendType: blendType,
      billingCycleAnchor: billingCycle, // this value should be 'now' or 'unchanged'
      items,
    };
    console.log(payload);
    dispatch(
      updateUserSubscription(
        subscription?.subscriptionItem?.stripeSubscription?.id,
        payload
      )
    );
  };

  const toggleModal = (billingAnchor) => {
    setIsModalOpen(!isModalOpen);
    setBillingAnchor(billingAnchor);
  };

  return (
    <div className="bg-white">
      <div className="sub-management-container">
        <Row>
          <Col className="sub-management-col">
            <p
              className="d-flex justify-content-center col-text"
              style={{ color: "black" }}
            >
              Next Invoice Due:
            </p>
          </Col>
          <Col className="d-flex justify-content-center sub-management-col">
            <p style={{ color: "black" }}>
              {" "}
              {moment(
                subscription?.subscriptionItem?.stripeSubscription
                  ?.billing_cycle_anchor * 1000
              )
                .add(1, "months")
                .format("DD-MM-YYYY")}
            </p>
          </Col>
          <Col className="sub-management-col"></Col>
        </Row>
        <Row>
          <Col className="sub-management-col">
            <p className="d-flex justify-content-center col-text">
              I can't wait
            </p>
          </Col>
          <Col className="d-flex justify-content-center sub-management-col">
            <button
              style={{ background: updating && "#333" }}
              className="gold-sub-btn"
              disabled={updating}
              // onClick={() => handleSubmit("now")}
              onClick={() => toggleModal("now")}
            >
              SEND IT NOW
            </button>
          </Col>
          <Col className="d-flex justify-content-center sub-management-col">
            {/* <p>Now due:</p>
              <h2>10 OCT 21</h2> */}
          </Col>
        </Row>
        <Row className="skip-row">
          <Col className="d-flex justify-content-center sub-management-col">
            <p className="col-text">Put on hold</p>
          </Col>
          <Col className="d-flex justify-content-center  sub-management-col">
            {subscription?.isPause ? (
              <button
                style={{ background: updating && "#333" }}
                className="gold-sub-btn"
                disabled={updating}
                onClick={() => toggleModal("unpause")}
                // onClick={() => handleSubmit("pause")}
              >
                UNPAUSE
              </button>
            ) : (
              <button
                style={{ background: updating && "#333" }}
                className="gold-sub-btn"
                disabled={updating}
                onClick={() => toggleModal("pause")}
                // onClick={() => handleSubmit("pause")}
              >
                PAUSE IT
              </button>
            )}
          </Col>
          <Col className="sub-management-col"></Col>
        </Row>
        <Row className="skip-row">
          <Col className="d-flex justify-content-center sub-management-col">
            <p className="col-text">Skip delivery</p>
          </Col>
          <Col className="d-flex justify-content-center  sub-management-col">
            <button className="gold-sub-btn">SKIP IT</button>
          </Col>
          <Col className="sub-management-col"></Col>
        </Row>
        <Row className="carousel-subscription">
          <Col></Col>
          <Col>
            <img
              className="img-subs"
              src={subscription?.subscriptionItem?.stripeProductImageUrl}
              alt="hunterKiller"
            ></img>
          </Col>
          <Col></Col>
        </Row>
        <Row className="separate-btns">
          <Col className="d-flex justify-content-center sub-management-col">
            <button
              className="reduce-qty"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity === 1}
            >
              -
            </button>
          </Col>
          <Col className="d-flex justify-content-center sub-management-col">
            {quantity}
          </Col>
          <Col className="d-flex justify-content-center sub-management-col">
            <button
              className="increase-qty"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </Col>
        </Row>
        <Row className="skip-row">
          {subscription?.subscriptionItem?.prices?.map((price, index) => (
            <Col
              key={index}
              className="d-flex justify-content-center  sub-management-col"
            >
              <button
                className={
                  packSize.id === price.id ? "gold-sub-btn" : "choice-sub-btn"
                }
                value={packSize}
                onClick={() => {
                  setPackSize({
                    id: price.id,
                    amount: price.unit_amount / 100,
                  });
                }}
              >
                {price?.nickname}
              </button>
            </Col>
          ))}
        </Row>

        <Row className="separate-btns">
          {blendTypes?.map((item) => (
            <Col key={item.id} className=" sub-management-col">
              <button
                className={
                  blendType === item.name ? "gold-sub-btn" : "choice-sub-btn"
                }
                value={item.name}
                onClick={(e) => setBlendType(e.target.value)}
              >
                {item.name}
              </button>
            </Col>
          ))}
        </Row>
        <Row className="separate-btns">
          <Col className="d-flex justify-content-center sub-management-col">
            <button
              style={{ background: updating && "#333" }}
              className="gold-sub-btn"
              onClick={() => toggleModal("unchanged")}
              disabled={updating}
            >
              UPDATE
            </button>
          </Col>
          <Col className="d-flex justify-content-center  sub-management-col">
            <Button variant="light" className="black-sub-btn">
              Cancel
            </Button>
          </Col>
        </Row>
        <Row className="separate-btns">
          <Col className="d-flex justify-content-center  sub-management-col">
            <h4>Total Price: £{quantity * packSize?.amount}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="separate-subs"></div>
          </Col>
        </Row>
      </div>

      <ConfirmationModal
        loading={loading}
        isShow={isModalOpen}
        handleClose={toggleModal}
        handleSubmit={handleSubmit}
        billingAnchor={billingAnchor}
        message={updateSuccessMessage}
      />
    </div>
  );
};

export default SubscriptionItem;
