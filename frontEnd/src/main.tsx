import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import App from "./App";
import AllCategory from "./components/Category/Category";
import BreakFast from "./components/Category/BreakFast";
import MeatCategory from "./components/Category/MeatCategory";
import Cart from "./components/Cart";
import LoginPage from "./components/Authentication/LoginPage";
import SignUp from "./components/Authentication/SignUp";
import LoginLanding from "./components/Authentication/LoginLanding";
import "./output.css";
import {
  fetchBreakfast,
  fetchProduct,
  fetchRandomMeal,
  fetchSeeFood,
  fetchSpecialIngredientMeal,
} from "./Redux/Productslice";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import SuccessCart from "./components/successCart";
import AdminDashboard from "./components/Admin/AdminDashboard";
import OrderTracking from "./components/Admin/OrderTracking";
import MyOrderTracking from "./components/MyOrder";

// Fetch initial data
store.dispatch(fetchProduct());
store.dispatch(fetchBreakfast());
store.dispatch(fetchRandomMeal());
store.dispatch(fetchSpecialIngredientMeal());
store.dispatch(fetchSeeFood());

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "/",
            element: <AllCategory />,
            index: true,
          },
          {
            path: "/breakfast",
            element: <BreakFast />,
          },
          {
            path: "/seefood",
            element: <MeatCategory />,
          },
        ],
      },
    ],
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/success",
    element: <SuccessCart />,
  },
  {
    path: "/Landing",
    element: <LoginLanding />,
    children: [
      {
        path: "/Landing/login",
        element: <LoginPage />,
        index: true,
      },
      {
        path: "/Landing/Signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/orderTrack",
    element: <OrderTracking />,
  },
  {
    path: "/MyOrders",
    element: <MyOrderTracking />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
