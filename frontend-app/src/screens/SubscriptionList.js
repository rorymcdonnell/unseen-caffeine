import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  cancelUserSubscription,
  getUserSubscriptionsList,
  openCancelSubscriptionModal,
} from "../actions/subscriptionActions";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";

const SubscriptionListScreen = ({ history }) => {
  const [subscriptionId, setSubscriptionId] = useState({});

  const { isShow } = useSelector((state) => state.openCancelSubscriptionModal);
  const dispatch = useDispatch();

  const handleClose = (subscriptionId, id) => {
    setSubscriptionId({ subscriptionId, id });
    dispatch(openCancelSubscriptionModal(!isShow));
  };

  const subscriptionList = useSelector((state) => state.subscriptionsList);

  const { loading, subscriptions } = subscriptionList;

  const cancelSubscription = useSelector((state) => state.cancelSubscription);
  const { canceling, canceled } = cancelSubscription;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserSubscriptionsList());
    } else {
      history.push("/login");
    }
    // if (canceled) {
    //   window.location = "/subscriptionlist";
    // }
  }, [dispatch, history, userInfo, canceled]);

  const handleSubmit = () => {
    dispatch(
      cancelUserSubscription(subscriptionId.subscriptionId, subscriptionId.id)
    );
  };

  console.log(subscriptions);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>PRODUCT</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>DETAILS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.subscriptionItem?.stripeProductName}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>£{order.subscriptionItem?.stripeProductPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() =>
                      handleClose(
                        order.subscriptionItem?.stripeSubscriptionId,
                        order._id
                      )
                    }
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <CancelSubscriptionModal
        isShow={isShow}
        loading={canceling}
        loaded={canceled}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default SubscriptionListScreen;
