import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { updateUserSubscription } from "../actions/subscriptionActions";

const UnpauseModal = ({
  isShow,
  handleClose,
  subscriptionIds,
  message,
  loading,
}) => {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const payload = {
      id: subscriptionIds?.id,
      billingCycleAnchor: "void",
    };
    dispatch(updateUserSubscription(subscriptionIds?.subscriptionId, payload));
  };

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subscription Unpause</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message ? (
          <div className="alert alert-success">{message}</div>
        ) : (
          <div className="alert alert-info">
            Are you sure, you want to resume your subscription?
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!message ? (
          <Button disabled={loading} variant="secondary" onClick={handleClose}>
            Close
          </Button>
        ) : (
          <Button
            disabled={loading}
            variant="secondary"
            onClick={() => (window.location = "/profile/my-subscriptions")}
          >
            Close
          </Button>
        )}
        {!message && (
          <Button variant="primary" disabled={loading} onClick={handleSubmit}>
            YES
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UnpauseModal;
