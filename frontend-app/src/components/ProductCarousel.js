import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { listCarouselProducts } from "../actions/productActions";
import Rating from "./Rating";

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  console.log(products);
  const order = [
    "6155a5a1ebfbd70ea836dc2c",
    "6155a5a1ebfbd70ea836dc30",
    "6155a5a1ebfbd70ea836dc2e",
    "6155a5a1ebfbd70ea836dc32",
  ];

  const sortedProductCarousel = products.sort((a, b) => {
    return order.indexOf(a._id) - order.indexOf(b._id);
  });

  console.log("SORTED?", sortedProductCarousel);

  useEffect(() => {
    dispatch(listCarouselProducts());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Carousel>
        {products?.map((product, index) => (
          <Carousel.Item key={index}>
            <Link to={`/product/${product._id}`}>
              <img
                // className="d-block w-100"
                src={product.image}
                alt={product.name}
              />
              <Carousel.Caption>
                <h3 className="text-white">{product.name}</h3>
                {/* <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p> */}
                <div style={{ marginTop: "14.5rem" }}>
                  <Rating className="carousel-rating" value={product.rating} />
                </div>
                <div style={{ marginTop: "1.5rem" }}>
                  <p>{product.roast}</p>
                </div>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
      {/* <div>
        <Carousel indicatorLabels={labels} className="bg-dark">
          {products.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} />
                <Carousel.Caption className="carousel-caption">
                  <h2>
                    {product.name} (£{product.price})
                  </h2>

                  <Rating
                    className="carousel-rating"
                    value={product.rating}
                  ></Rating>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div>
        <p className="carousel-indicator">Medium</p>
      </div> */}
    </div>
  );
};

export default ProductCarousel;
