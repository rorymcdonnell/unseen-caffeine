import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const SubscriptionModal = ({ isShow, product, handleClose }) => {
  const history = useHistory();
  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-info">
          By subscribing to this product, you will be charged each month.
          <br /> <b>You can cancel your subscription anytime.</b>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            history.push({
              pathname: "/shipping",
              state: { type: "subscription", product },
            })
          }
        >
          Subscribe
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;
