import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateUserSubscription } from "../actions/subscriptionActions";

const UpdateSubscriptionModal = ({
  isShow,
  loading,
  handleClose,
  subscriptionItems,
  updateSuccessMessage,
}) => {
  const dispatch = useDispatch();

  const [packs, setPacks] = useState(0);
  const [plan, setPlan] = useState("");

  useEffect(() => {
    if (subscriptionItems?.price) {
      setPlan(subscriptionItems?.price);
      setPacks(subscriptionItems?.quantity);
    }
  }, [subscriptionItems?.price, subscriptionItems?.quantity]);

  const handleSubmit = () => {
    const items = [
      {
        id: subscriptionItems?.plan,
        quantity: parseInt(packs),
        deleted: plan !== subscriptionItems?.price ? true : false,
      },
    ];
    if (plan !== subscriptionItems?.price) {
      items.push({ price: plan, quantity: parseInt(packs) });
    }
    const payload = {
      id: subscriptionItems?.id,
      items,
    };

    dispatch(
      updateUserSubscription(subscriptionItems?.subscriptionId, payload)
    );
  };

  const handleRedirect = () => {
    window.location = "/profile/my-subscriptions";
  };

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {updateSuccessMessage ? (
          <div className="alert alert-success">{updateSuccessMessage}</div>
        ) : (
          <>
            <div className="form-group">
              <label className="label-control">Select a Plan</label>
              <select
                className="form-control"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                {subscriptionItems?.items?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.id === subscriptionItems?.price
                      ? `${item.nickname} (Current Plan)`
                      : item.nickname}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label-control">Packs</label>
              <input
                type="number"
                className="form-control"
                value={packs}
                onChange={(e) => setPacks(e.target.value)}
              />
              {!packs && (
                <div className="alert alert-danger">
                  Please enter the quantity
                </div>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!updateSuccessMessage ? (
          <Button disabled={loading} variant="secondary" onClick={handleClose}>
            Close
          </Button>
        ) : (
          <Button
            disabled={loading}
            variant="secondary"
            onClick={handleRedirect}
          >
            Close
          </Button>
        )}
        {!updateSuccessMessage && (
          <Button
            disabled={!packs || loading}
            variant="primary"
            onClick={handleSubmit}
          >
            Update
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateSubscriptionModal;
