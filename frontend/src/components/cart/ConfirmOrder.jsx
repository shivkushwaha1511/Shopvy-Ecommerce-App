import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { caluclateOrderCost } from "../../helpers/helpers";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const { user } = useSelector((state) => state.auth);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const { itemsCost, shippingCost, taxCost, totalCost } =
    caluclateOrderCost(cartItems);
  return (
    <>
      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo?.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b> {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.state}, {shippingInfo?.country?.name} -{" "}
            {shippingInfo?.zipCode}
          </p>

          <hr />
          <h4 className="mt-4">Your Cart Items:</h4>

          <hr />
          {cartItems.map((item) => (
            <div className="cart-item my-1">
              <div className="row">
                <div className="col-4 col-lg-2">
                  <img src={item?.image} alt="Laptop" height="45" width="65" />
                </div>

                <div className="col-5 col-lg-6">
                  <Link to={item?.url}>{item?.name}</Link>
                </div>

                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                  <p>
                    {item?.quantity} x &#8377;{item?.price} ={" "}
                    <b>&#8377;{item?.quantity * item?.price}</b>
                  </p>
                </div>
              </div>
            </div>
          ))}
          <hr />
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal:{" "}
              <span className="order-summary-values">&#8377;{itemsCost}</span>
            </p>
            <p>
              Shipping:{" "}
              <span className="order-summary-values">
                {shippingCost === 0 ? "Free" : `&#8377;${shippingCost}`}
              </span>
            </p>
            <p>
              Tax:{" "}
              <span className="order-summary-values">&#8377;{taxCost}</span>
            </p>

            <hr />

            <p>
              Total:{" "}
              <span className="order-summary-values">&#8377;{totalCost}</span>
            </p>

            <hr />
            <Link
              to="/payment_method"
              id="checkout_btn"
              className="btn btn-primary w-100"
            >
              Proceed to Payment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
