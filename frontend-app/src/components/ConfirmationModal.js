import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  isShow,
  loading,
  message,
  handleClose,
  billingAnchor,
  handleSubmit,
}) => {
  const history = useHistory();

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subscription Update Confirmation.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message ? (
          <div className="alert alert-success">{message}</div>
        ) : (
          <div className="alert alert-info">
            Are you sure, you want to update your subscription?
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
            onClick={() => history.push("/profile/my-subscriptions")}
          >
            Close
          </Button>
        )}
        {!message && (
          <Button
            disabled={loading}
            variant="primary"
            onClick={() => handleSubmit(billingAnchor)}
          >
            Update
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
