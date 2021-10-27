import React, { useEffect, useState } from "react";
import moment from "moment";
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
                    onClick={() => history.push(`/subscription/${item._id}`)}
                  >
                    Update
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
