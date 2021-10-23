import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import ucMug from "../images/uc-mug.jpeg";
import ucVideo from "../videos/final-video.nosync.mp4";
import goldMug from "../images/uc-gold.jpeg";
import blackMug from "../images/uc-black-mug.jpeg";
import blackTee from "../images/BLACK-TEE.png";
import originalMug from "../images/original-mug.jpeg";
import heroImg from "../images/unseencaffeine-hero-img.jpeg";
import { Parallax } from "react-parallax";

const inlineStyle = {
  background: "#fff",
  left: "50%",
  top: "50%",
  position: "absolute",
  padding: "20px",
  transform: "translate(-50%, -50%)",
};

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      <div className="hero-section">
        <h2 className="home-header-banner">SPECIALITY COFFEE ROASTERS</h2>
        <div className="video-container">
          <video
            className="uc-video"
            autostart
            loop
            muted
            autoPlay
            src={ucVideo}
          ></video>
        </div>
        <div classname="background-image-hero">
          {/* <div className="hero-buttons-container">
            <button>COFFEE</button>
            <button>MERCHANDISE</button>
            <button>WHOLESALE</button>
          </div> */}
        </div>
      </div>

      <div>
        {/* <p className="our-coffee">our coffee...</p> */}
        {!keyword ? (
          <ProductCarousel />
        ) : (
          <Link to="/" className="btn btn-light">
            Go Back
          </Link>
        )}
        {/* <img
          className="hunter-killer-img"
          src={hunterKiller}
          alt="hunter-killer-coffee"
        ></img> */}
      </div>

      <Parallax bgImage={ucMug} strength={500}>
        <div style={{ height: 400 }}>
          <div className="mug-text">
            <h2>CLOTHING AND MERCHANDISE</h2>
            <button>SHOP NOW</button>
          </div>
        </div>
      </Parallax>

      <div className="free-delivery-section">
        <p className="free-delivery">free delivery on all orders over £25</p>
        <div className="four-products-container">
          <div className="product-container-1">
            <img className="free-img" src={goldMug}></img>
            <p>BLACK AND GOLD MUG £11.95</p>
          </div>
          <div className="product-container-2">
            <img className="free-img" src={originalMug}></img>
            <p>ORIGINAL UNSEEN MUG £9.95</p>
          </div>
          <div className="product-container-3">
            <img className="free-img" src={blackTee}></img>
            <p>UNSEEN BLACK TEE £15.95</p>
          </div>
          <div className="product-container-4">
            <img className="free-img" src={blackMug}></img>
            <p>BLACK AND BLACK MUG £11.95</p>
          </div>
        </div>
      </div>
      <Parallax bgImage={heroImg} strength={500}>
        <div style={{ height: 400 }}>
          <div className="mug-text">
            <p className="wholesale-text">
              WHETHER YOU’RE A COFFEE SHOP/MESS DECK/HOTEL OR RESTAURANT - WE’D
              LOVE TO PARTNER WITH YOU
            </p>
            <button>Get in touch</button>
          </div>
        </div>
      </Parallax>

      {/* <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )} */}
    </>
  );
};

export default HomeScreen;
