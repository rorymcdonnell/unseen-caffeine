import React from "react";
// import { Spinner } from 'react-bootstrap'
import lottie from "lottie-web";
import animationData from "../lotties/coffeeLoad.json";

const Loader = () => {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#react-logo"),
      animationData: animationData,
    });
  }, []);

  return (
    <div>
      <div id="react-logo" style={{ width: 200, height: 200 }}></div>
    </div>
  );
};

export default Loader;
