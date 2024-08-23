import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { Link, useParams } from "react-router-dom";
import {
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";

const ProcessOrder = () => {
  const params = useParams();
  const { data } = useGetOrderDetailQuery(params?.id);

  const [status, setStatus] = useState("");
  const [updateOrder, { error, isSuccess }] = useUpdateOrderMutation();

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
    paymentMethod,
  } = data?.order || {};

  useEffect(() => {
    if (orderStatus) {
      setStatus(orderStatus);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Order Status Updated");
    }
  }, [error, isSuccess]);

  const handleUpdate = () => {
    updateOrder({ id: data?.order?._id, body: { status } });
  };

  return (
    <AdminLayout>
      <div class="row d-flex justify-content-around">
        <div class="col-12 col-lg-8 order-details">
          <h3 class="mt-5 mb-4">Order Details</h3>

          <table class="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{data?.order?._id}</td>
              </tr>
              <tr>
                <th scope="row">Status</th>
                <td
                  className={
                    orderStatus?.includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 class="mt-5 mb-4">Shipping Info</h3>
          <table class="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  {shippingInfo?.address}, {shippingInfo?.city},{" "}
                  {shippingInfo?.state}, {shippingInfo?.country?.name} -{" "}
                  {shippingInfo?.zipCode}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 class="mt-5 mb-4">Payment Info</h3>
          <table class="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td
                  className={
                    paymentInfo?.status === "Paid" ? "greenColor" : "redColor"
                  }
                >
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{paymentInfo?.id ? paymentInfo?.id : "Nill"}</td>
              </tr>
              <tr>
                <th scope="row">Amount Paid</th>
                <td>&#8377;{totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 class="mt-5 my-4">Order Items:</h3>

          <hr />
          {orderItems?.map((item) => (
            <div className="cart-item my-1">
              <div className="row my-5">
                <div className="col-4 col-lg-2">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    height="45"
                    width="65"
                  />
                </div>

                <div className="col-5 col-lg-5">
                  <Link to={`../product/${item.product}`}>{item?.name}</Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>{item?.price}</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{item?.quantity} Piece(s)</p>
                </div>
              </div>
            </div>
          ))}
          <hr />
        </div>

        <div class="col-12 col-lg-3 mt-5">
          <h4 class="my-4">Status</h4>

          <div class="mb-3">
            <select
              class="form-select"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <button class="btn btn-primary w-100" onClick={handleUpdate}>
            Update Status
          </button>

          <h4 class="mt-5 mb-3">Order Invoice</h4>
          <Link
            to={`/invoice/orders/${data?.order?._id}`}
            class="btn btn-success w-100"
          >
            <i class="fa fa-print"></i> Generate Invoice
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProcessOrder;
