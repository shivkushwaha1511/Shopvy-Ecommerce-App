import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { caluclateOrderCost } from "../../helpers/helpers";
import {
  useCreateStripeSessionMutation,
  usePlaceNewOrderMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { itemsCost, shippingCost, taxCost, totalCost } =
    caluclateOrderCost(cartItems);

  const [placeNewOrder, { error, isSuccess }] = usePlaceNewOrderMutation();
  const [
    createStripeSession,
    { error: paymentError, isLoading, data: paymentData },
  ] = useCreateStripeSessionMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError?.data?.message);
    }

    if (paymentData) {
      window.location.href = paymentData?.url;
    }
  }, [paymentData, paymentError]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Order placed");
      navigate(`/me/orders?paymentSuccess=${true}`);
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (paymentMethod === "COD") {
      const orderData = {
        shippingInfo: { ...shippingInfo, country: shippingInfo?.country?.name },
        orderItems: cartItems,
        paymentMethod,
        paymentInfo: {
          status: "Not Paid",
        },
        itemsPrice: itemsCost,
        taxAmount: taxCost,
        shippingAmount: shippingCost,
        totalAmount: totalCost,
      };

      placeNewOrder(orderData);
    } else if (paymentMethod === "Card") {
      const orderData = {
        shippingInfo: { ...shippingInfo, country: shippingInfo?.country?.name },
        orderItems: cartItems,
        itemsPrice: itemsCost,
        taxAmount: taxCost,
        shippingAmount: shippingCost,
        totalAmount: totalCost,
      };
      createStripeSession(orderData);
    }
  };

  return (
    <>
      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input border border-secondary"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setPaymentMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input border border-secondary"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                defaultChecked
                onChange={(e) => setPaymentMethod("Card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard / UPI
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100"
              disabled={isLoading}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
