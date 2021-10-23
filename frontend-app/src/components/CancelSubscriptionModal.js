import React from "react";
import { Modal, Button } from "react-bootstrap";

const CancelSubscriptionModal = ({
  isShow,
  loading,
  loaded,
  handleClose,
  handleSubmit,
}) => {
  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!loaded ? (
          <div className="alert alert-danger">
            Do you really want to cancel this subscription?
          </div>
        ) : (
          <div className="alert alert-success">
            Subscription Cancelled Successfully
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {!loaded && (
          <Button disabled={loading} variant="primary" onClick={handleSubmit}>
            Cancel
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CancelSubscriptionModal;
