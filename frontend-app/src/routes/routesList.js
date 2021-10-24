import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";
import CartScreen from "../screens/CartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ShippingScreen from "../screens/ShippingScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PlaceOrderScreen from "../screens/PlaceOrderScreen";
import OrderScreen from "../screens/OrderScreen";
import UserListScreen from "../screens/UserListScreen";
import UserEditScreen from "../screens/UserEditScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductEditScreen from "../screens/ProductEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import SubscriptionManagement from "../screens/SubscriptionManagement";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import SubscriptionCheckoutScreen from "../screens/SubscriptionCheckoutScreen";
import SubscriptionListScreen from "../screens/SubscriptionList";
import CoffeeProducts from "../screens/CoffeeProducts";
import MerchandiseProducts from "../screens/MerchandiseProducts";
import SubscriptionItem from "../screens/SubscriptionItem";

const routeTypes = { public: "public", private: "private" };

export const routesList = [
  {
    path: "/register",
    component: RegisterScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/login",
    component: LoginScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/placeorder",
    component: PlaceOrderScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/payment",
    component: PaymentScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/shipping",
    component: ShippingScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/order/:id",
    component: OrderScreen,
    routeType: routeTypes.private,
  },

  {
    path: "/profile/my-subscriptions",
    component: SubscriptionManagement,
    routeType: routeTypes.private,
  },
  {
    path: "/profile",
    component: ProfileScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/shop",
    component: CoffeeProducts,
    routeType: routeTypes.public,
  },
  {
    path: "/merchandise",
    component: MerchandiseProducts,
    routeType: routeTypes.public,
  },
  {
    path: "/subscriptions",
    component: SubscriptionScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/subscription/:id",
    component: SubscriptionItem,
    routeType: routeTypes.private,
  },
  {
    path: "/checkout",
    component: SubscriptionCheckoutScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/product/:id",
    component: ProductScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/cart/:id?",
    component: CartScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/admin/userlist",
    component: UserListScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/admin/user/:id/edit",
    component: UserEditScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/admin/productlist",
    component: ProductListScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/admin/productlist/:pageNumber",
    component: ProductListScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/admin/product/:id/edit",
    component: ProductEditScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/admin/orderlist",
    component: OrderListScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/subscriptionlist",
    component: SubscriptionListScreen,
    routeType: routeTypes.private,
  },
  {
    path: "/search/:keyword",
    component: HomeScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/page/:pageNumber",
    component: HomeScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/search/:keyword/page/:pageNumber",
    component: HomeScreen,
    routeType: routeTypes.public,
  },
  {
    path: "/",
    component: HomeScreen,
    routeType: routeTypes.public,
  },
];
