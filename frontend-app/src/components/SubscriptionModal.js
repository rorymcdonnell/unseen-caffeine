import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { saveBlendType } from "../actions/cartActions";

const SubscriptionModal = ({ isShow, product, handleClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [blendType, setBlendType] = useState("Wholebean");

  const handleSubmit = () => {
    history.push({
      pathname: "/shipping",
      state: { type: "subscription", product },
    });
    dispatch(saveBlendType({ blendType }));
  };

  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subscription {blendType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-info">
          By subscribing to this product, you will be charged each month.
          <br /> <b>You can cancel your subscription anytime.</b>
        </div>

        <div className="mt-5">
          <label className="label-control">Select Blend Type</label>
          <select
            className="form-control"
            value={blendType}
            onChange={(e) => setBlendType(e.target.value)}
          >
            <option disabled selected>
              Blend Type
            </option>
            <option value="Wholebean">Wholebean</option>
            <option value="Filter">Filter</option>
            <option value="Cafetiere">Cafetiere</option>
            <option value="Espresso">Espresso</option>
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Subscribe
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;
