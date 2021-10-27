import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { confirmEmail } from "../actions/userActions";
import Message from "../components/Message";

const EmailConfirmation = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const confirm = useSelector((state) => state.emailConfirmation);
  const { loading, message, success } = confirm;
  console.log(confirm);

  useEffect(() => {
    dispatch(confirmEmail(params?.token));
  }, [dispatch, params]);

  if (loading) {
    return <p>Verifying...</p>;
  }

  return (
    <>
      {message && (
        <Message variant="info">
          {message} {success && <Link to="/login">Login</Link>}
        </Message>
      )}
    </>
  );
};

export default EmailConfirmation;
