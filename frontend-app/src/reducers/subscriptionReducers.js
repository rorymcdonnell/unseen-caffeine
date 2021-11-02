import {
  openSubscriptionModal,
  openUpdateSubscriptionModal,
} from "../actions/subscriptionActions";
import {
  CREATE_USER_SUBSCRIPTION,
  CREATE_USER_SUBSCRIPTION_SUCCESS,
  CREATE_USER_SUBSCRIPTION_FAILED,
  GET_SUBSCRIPTION_PRODUCTS,
  GET_SUBSCRIPTION_PRODUCTS_FAILED,
  GET_SUBSCRIPTION_PRODUCTS_SUCCESS,
  OPEN_SUBSCRIPTION_MODAL_SUCCESS,
  GET_SUBSCRIPTIONS_LIST_SUCCESS,
  GET_SUBSCRIPTIONS_LIST,
  GET_SUBSCRIPTIONS_LIST_FAILED,
  CANCEL_USER_SUBSCRIPTION_SUCCESS,
  CANCEL_USER_SUBSCRIPTION_FAILED,
  CANCEL_USER_SUBSCRIPTION,
  OPEN_CANCEL_SUBSCRIPTION_MODAL,
  OPEN_UPDATE_SUBSCRIPTION_MODAL,
  UPDATE_USER_SUBSCRIPTION,
  UPDATE_USER_SUBSCRIPTION_SUCCESS,
  UPDATE_USER_SUBSCRIPTION_FAILED,
  GET_SUBSCRIPTION_ITEM_BY_ID,
  GET_SUBSCRIPTION_ITEM_BY_ID_SUCCESS,
  GET_SUBSCRIPTION_ITEM_BY_ID_FAILED,
  SUBSCRIPTION_CREATE_RESET,
} from "../constants/subscriptionConstants";

const initialState = {
  isShow: false,
  message: "",
  loaded: false,
  loading: false,

  subscriptions: [],
  openUpdateModal: false,
  updating: false,
  sendning: false,
  pausing: false,
  updateSuccessMessage: "",
};

export const subscriptionProductsReducer = (
  state = { products: [] },
  action
) => {
  switch (action.type) {
    case GET_SUBSCRIPTION_PRODUCTS:
      return { loading: true, products: [] };
    case GET_SUBSCRIPTION_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
      };
    case GET_SUBSCRIPTION_PRODUCTS_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const openSubscriptionModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SUBSCRIPTION_MODAL_SUCCESS:
      return { isShow: action.payload };
    default:
      return state;
  }
};

export const openCancelSubscriptionModalReducer = (
  state = { isShow: false },
  action
) => {
  switch (action.type) {
    case OPEN_CANCEL_SUBSCRIPTION_MODAL:
      return { isShow: action.payload };
    default:
      return state;
  }
};

export const openUpdateSubscriptionModalReducer = (
  state = { initialState },
  action
) => {
  switch (action.type) {
    case OPEN_UPDATE_SUBSCRIPTION_MODAL:
      return { ...state, openUpdateModal: action.payload };
    default:
      return state;
  }
};

export const createUserSubscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_SUBSCRIPTION:
      return { ...state, loading: true, loaded: false };
    case CREATE_USER_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        message: action.payload,
        isShow: openSubscriptionModal(false),
      };
    case CREATE_USER_SUBSCRIPTION_FAILED:
      return { ...state, loading: false, error: action.payload };
    case SUBSCRIPTION_CREATE_RESET:
      return {
        ...state,
        loading: false,
        error: "",
        loaded: false,
        message: "",
      };
    default:
      return state;
  }
};

export const updateUserSubscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_SUBSCRIPTION:
      return { ...state, updating: true, sending: true, pausing: true };
    case UPDATE_USER_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        updating: false,
        sending: false,
        pausing: false,
        openUpdateModal: false,
        subscriptions: action.payload.subscription,
        updateSuccessMessage: action.payload.message,
      };
    case UPDATE_USER_SUBSCRIPTION_FAILED:
      return { ...state, updating: false, error: action.payload };
    default:
      return state;
  }
};

export const getUserSubscriptionsListReducer = (
  state = { initialState },
  action
) => {
  switch (action.type) {
    case GET_SUBSCRIPTIONS_LIST:
      return { loading: true, subscriptions: [] };
    case GET_SUBSCRIPTIONS_LIST_SUCCESS:
      return {
        loading: false,
        subscriptions: action.payload.subscriptions,
      };
    case GET_SUBSCRIPTIONS_LIST_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cancelUserSubscriptionReducer = (
  state = { canceling: false, canceled: false },
  action
) => {
  switch (action.type) {
    case CANCEL_USER_SUBSCRIPTION:
      return { loading: true, subscriptions: [] };
    case CANCEL_USER_SUBSCRIPTION_SUCCESS:
      return {
        canceling: false,
        canceled: true,
      };
    case CANCEL_USER_SUBSCRIPTION_FAILED:
      return { canceling: false, error: action.payload };
    default:
      return state;
  }
};

export const getSubscriptionByIdReducer = (
  state = { subscription: {}, loading: false },
  action
) => {
  switch (action.type) {
    case GET_SUBSCRIPTION_ITEM_BY_ID:
      return {
        loading: true,
      };
    case GET_SUBSCRIPTION_ITEM_BY_ID_SUCCESS:
      return {
        loading: false,
        subscription: action.payload?.subscription,
      };
    case GET_SUBSCRIPTION_ITEM_BY_ID_FAILED:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
