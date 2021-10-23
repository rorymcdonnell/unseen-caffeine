import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserSubscription,
  listSubscriptionProducts,
  openSubscriptionModal,
} from "../actions/subscriptionActions";
import { getUserDetails } from "../actions/userActions";
import StripeContainer from "../components/Stripe/Container";
import SubscriptionModal from "../components/SubscriptionModal";

const SubscriptionScreen = () => {
  //   const [isShow, setIsShow] = useState(false);
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    dispatch(listSubscriptionProducts());
    dispatch(getUserDetails(user._id));
  }, [listSubscriptionProducts]);

  const subscriptionProducts = useSelector(
    (state) => state.subscriptionProducts
  );
  const { loading, products } = subscriptionProducts;

  const isSubscriptionModalOpen = useSelector(
    (state) => state.isSubscriptionModalOpen
  );
  const { isShow } = isSubscriptionModalOpen;

  const handleClose = (payload) => {
    dispatch(openSubscriptionModal(!isShow));
    const product = {
      id: payload.id,
      name: payload.name,
      image: payload.image,
      price: payload.price,
      prices: payload.prices,
    };
    setProduct(product);
  };

  const handleCreateSubscription = (token) => {
    const payload = {
      name: user.name,
      email: user.email,
      token,
    };
    dispatch(createUserSubscription(payload));
  };

  return (
    <div>
      {loading && <p className="text-white">loading....</p>}

      <div className="container">
        <div className="row">
          {products?.map((product, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card">
                {/* <div className="card-header">{product.name}</div> */}
                <img
                  className="card-img-top"
                  src={product.images[0]}
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <strong>{product.name}</strong>
                  </h5>
                  <p className="card-text">{product.description}</p>
                </div>
                {product?.price?.map((price, index) => (
                  <div key={index}>
                    <button
                      className="btn btn-primary btn-block mt-1"
                      onClick={() =>
                        handleClose({
                          id: product.id,
                          name: product.name,
                          image: product.images[0],
                          price: price,
                          prices: product?.price,
                        })
                      }
                    >
                      £{price?.unit_amount / 100}/{price?.recurring.interval} (
                      {price?.nickname})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <StripeContainer>
        <SubscriptionModal
          isShow={isShow}
          product={product}
          handleClose={handleClose}
          handleSubmit={handleCreateSubscription}
        />
      </StripeContainer>
    </div>
  );
};

export default SubscriptionScreen;
