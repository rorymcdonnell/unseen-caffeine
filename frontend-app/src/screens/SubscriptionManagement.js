import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Container, Table } from "react-bootstrap";
import {
  cancelUserSubscription,
  getUserSubscriptionsList,
  openCancelSubscriptionModal,
  openUpdateSubscriptionModal,
  getUserSubscriptionItemById,
  updateUserSubscription,
} from "../actions/subscriptionActions";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";
import Loader from "../components/Loader";
import UpdateSubscriptionModal from "../components/UpdateSubscriptionModal";
import "../subscription.css";

const SubscriptionManagement = () => {
  const [subscriptionId, setSubscriptionId] = useState({});
  const [subscriptionItems, setSubscriptionItems] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [packSize, setPackSize] = useState("250g");
  const [blendType, setBlendType] = useState("Filter");

  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const history = useHistory();

  const subscriptionList = useSelector((state) => state.subscriptionsList);

  const { loading, subscriptions } = subscriptionList;

  const { isShow } = useSelector((state) => state.openCancelSubscriptionModal);
  const { openUpdateModal: isUpdateSubscriptionModalOpen } = useSelector(
    (state) => state.openUpdateSubscriptionModal
  );

  const { updating, updateSuccessMessage } = useSelector(
    (state) => state.updateUserSubscription
  );
  const dispatch = useDispatch();

  const handleClose = (subscriptionId, id) => {
    setSubscriptionId({ subscriptionId, id });
    dispatch(openCancelSubscriptionModal(!isShow));
  };

  const toggleUpdateSubscriptionModal = (payload) => {
    if (!isUpdateSubscriptionModalOpen) {
      const data = {
        id: payload.id,
        items: payload?.subscriptionItems,
        subscriptionId: payload.subscriptionId,
        price: payload.price,
        quantity: payload.quantity,
        plan: payload.plan,
      };
      setSubscriptionItems(data);
      dispatch(openUpdateSubscriptionModal(!isUpdateSubscriptionModalOpen));
    } else {
      dispatch(openUpdateSubscriptionModal(!isUpdateSubscriptionModalOpen));
    }
  };
  // Get user subscription from stripe
  const subscriptionItemTest = useSelector(
    (state) => state.subscriptionItemTest
  );

  // Cancel subscription
  const cancelSubscription = useSelector((state) => state.cancelSubscription);
  const { canceling, canceled } = cancelSubscription;

  // Hook for displaying getting the subscriptions.
  useEffect(() => {
    if (userInfo) {
      dispatch(getUserSubscriptionsList());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, canceled]);

  const handleSubmit = () => {
    dispatch(
      cancelUserSubscription(subscriptionId.subscriptionId, subscriptionId.id)
    );
  };

  //  Here is the function to at least get the subscription information from stripe on the console log
  const handleSomething = (subscriptionId) => {
    dispatch(getUserSubscriptionItemById(subscriptionId));
  };

  const handleUpdate = (payload) => {
    const items = [
      {
        id: payload?.plan,
        quantity: parseInt(quantity),
        deleted: payload?.plan !== payload?.price ? true : false,
      },
    ];
    if (payload?.plan !== payload?.price) {
      items.push({ price: payload?.plan, quantity: parseInt(quantity) });
    }
    const data = {
      id: payload?.id,
      items,
    };
    dispatch(updateUserSubscription(payload?.subscriptionId, payload));
    console.log(data);
  };

  return (
    <div>
      <Container>
        <h1 style={{ color: "black" }}>Your Subscription</h1>
        <button
          className="btn btn-primary"
          onClick={() => history.push("/subscriptions")}
        >
          Our Subscription Products
        </button>

        <Table bordered responsive className="table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Size</th>
              <th>Blend Type</th>
              <th>Packs</th>
              <th>Next Invoice</th>
              <th>Price</th>
              <th>Amount</th>
              <th className="text-center">Pause</th>
              <th colSpan={2} className="text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item?.subscriptionItem?.stripeProductImageUrl}
                    alt="product image"
                    width={50}
                  />
                </td>
                <td>{item?.subscriptionItem?.stripeProductName}</td>
                <td>
                  {item?.subscriptionItem?.stripeSubscription?.plan?.nickname}
                </td>
                <td>
                  {
                    item?.subscriptionItem?.stripeSubscription?.metadata
                      ?.blendType
                  }
                </td>
                <td>{item?.subscriptionItem?.stripeSubscription?.quantity}</td>
                <td>
                  {moment(
                    item?.subscriptionItem?.stripeSubscription
                      ?.billing_cycle_anchor * 1000
                  )
                    .add(1, "months")
                    .format("DD-MM-YYYY")}
                </td>
                <td>
                  £
                  {item?.subscriptionItem?.stripeSubscription?.plan?.amount /
                    100}
                </td>
                <td>
                  £{" "}
                  {(item?.subscriptionItem?.stripeSubscription?.plan?.amount /
                    100) *
                    item?.subscriptionItem?.stripeSubscription?.quantity}
                </td>
                <td className="text-center">{item?.isPause ? "Yes" : "No"}</td>
                <td className="text-center">
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() =>
                      handleClose(
                        item?.subscriptionItem?.stripeSubscriptionId,
                        item?._id
                      )
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="light"
                    className="btn-sm ml-1"
                    disabled={item?.isPause}
                    onClick={() => history.push(`/subscription/${item._id}`)}
                  >
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <CancelSubscriptionModal
          isShow={isShow}
          loading={canceling}
          loaded={canceled}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />

        <UpdateSubscriptionModal
          loading={updating}
          subscriptionItems={subscriptionItems}
          isShow={isUpdateSubscriptionModalOpen}
          handleClose={toggleUpdateSubscriptionModal}
          updateSuccessMessage={updateSuccessMessage}
        />
      </Container>
    </div>
  );
};

export default SubscriptionManagement;
