import axios from "axios";
import {
  GET_SUBSCRIPTION_PRODUCTS,
  GET_SUBSCRIPTION_PRODUCTS_SUCCESS,
  GET_SUBSCRIPTION_PRODUCTS_FAILED,
  CREATE_USER_SUBSCRIPTION,
  CREATE_USER_SUBSCRIPTION_SUCCESS,
  CREATE_USER_SUBSCRIPTION_FAILED,
  OPEN_SUBSCRIPTION_MODAL_SUCCESS,
  GET_SUBSCRIPTIONS_LIST,
  GET_SUBSCRIPTIONS_LIST_FAILED,
  GET_SUBSCRIPTIONS_LIST_SUCCESS,
  CANCEL_USER_SUBSCRIPTION,
  CANCEL_USER_SUBSCRIPTION_FAILED,
  CANCEL_USER_SUBSCRIPTION_SUCCESS,
  OPEN_CANCEL_SUBSCRIPTION_MODAL,
  GET_SUBSCRIPTION_ITEM_BY_ID,
  GET_SUBSCRIPTION_ITEM_BY_ID_SUCCESS,
  GET_SUBSCRIPTION_ITEM_BY_ID_FAILED,
  OPEN_UPDATE_SUBSCRIPTION_MODAL,
  UPDATE_USER_SUBSCRIPTION,
  UPDATE_USER_SUBSCRIPTION_SUCCESS,
  UPDATE_USER_SUBSCRIPTION_FAILED,
} from "../constants/subscriptionConstants";
import { logout } from "./userActions";

export const listSubscriptionProducts = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_SUBSCRIPTION_PRODUCTS,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/subscription/products`, config);

    dispatch({
      type: GET_SUBSCRIPTION_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: GET_SUBSCRIPTION_PRODUCTS_FAILED,
      payload: message,
    });
  }
};

export const openSubscriptionModal = (payload) => (dispatch) => {
  dispatch({ type: OPEN_SUBSCRIPTION_MODAL_SUCCESS, payload });
};

export const openCancelSubscriptionModal = (payload) => (dispatch) => {
  dispatch({ type: OPEN_CANCEL_SUBSCRIPTION_MODAL, payload });
};

export const openUpdateSubscriptionModal = (payload) => (dispatch) => {
  dispatch({ type: OPEN_UPDATE_SUBSCRIPTION_MODAL, payload });
};

export const createUserSubscription =
  (payload) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CREATE_USER_SUBSCRIPTION,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/subscription/products",
        payload,
        config
      );

      dispatch({
        type: CREATE_USER_SUBSCRIPTION_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_USER_SUBSCRIPTION_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getUserSubscriptionsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_SUBSCRIPTIONS_LIST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/subscription/subscriptions`, config);

    dispatch({
      type: GET_SUBSCRIPTIONS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: GET_SUBSCRIPTIONS_LIST_FAILED,
      payload: message,
    });
  }
};

export const cancelUserSubscription =
  (subscriptionId, id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: CANCEL_USER_SUBSCRIPTION,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.delete(
        `/api/subscription/${id}/${subscriptionId}`,
        config
      );

      dispatch({
        type: CANCEL_USER_SUBSCRIPTION_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: CANCEL_USER_SUBSCRIPTION_FAILED,
        payload: message,
      });
    }
  };

export const getUserSubscriptionItemById =
  (id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_SUBSCRIPTION_ITEM_BY_ID,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/subscription/subscriptions/${id}`,
        config
      );
      console.log(data);
      dispatch({
        type: GET_SUBSCRIPTION_ITEM_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: GET_SUBSCRIPTION_ITEM_BY_ID_FAILED,
        payload: message,
      });
    }
  };

export const updateUserSubscription =
  (id, payload) => async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_USER_SUBSCRIPTION,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/subscription/subscriptions/${id}`,
        payload,
        config
      );

      dispatch({
        type: UPDATE_USER_SUBSCRIPTION_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_SUBSCRIPTION_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
