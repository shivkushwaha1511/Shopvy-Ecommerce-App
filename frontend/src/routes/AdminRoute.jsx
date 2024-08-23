import React from "react";

import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Dashboard from "../components/admin/Dashboard";
import ProductList from "../components/admin/ProductList";
import NewProduct from "../components/admin/NewProduct";
import UpdateProduct from "../components/admin/UpdateProduct";
import UploadProductImages from "../components/admin/UploadProductImages";
import OrderList from "../components/admin/OrderList";
import ProcessOrder from "../components/admin/ProcessOrder";
import UserList from "../components/admin/UserList";
import UpdateUser from "../components/admin/UpdateUser";
import ReviewList from "../components/admin/ReviewList";

const UserRoute = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute admin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute admin={true}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <ProtectedRoute admin={true}>
            <NewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id/upload_image"
        element={
          <ProtectedRoute admin={true}>
            <UploadProductImages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin={true}>
            <OrderList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute admin={true}>
            <ProcessOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute admin={true}>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute admin={true}>
            <ReviewList />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default UserRoute;
