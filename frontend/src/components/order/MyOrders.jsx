import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { useGetMyOrdersQuery } from "../../redux/api/orderApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const { data, isLoading, error } = useGetMyOrdersQuery();

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const paymentSuccess = searchParams.get("paymentSuccess");

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (paymentSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, paymentSuccess]);

  if (isLoading) {
    return <Loader />;
  }

  const getOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Date/Time",
          field: "date",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "payment_status",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "order_status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        date: new Date(order?.createdAt).toLocaleString("en-us"),
        amount: `₹ ${order?.totalAmount}`,
        payment_status: order?.paymentInfo?.status,
        order_status: order?.orderStatus,
        actions: (
          <>
            <Link to={`/me/orders/${order?._id}`} className="btn btn-primary">
              <i className="fa fa-eye fa-xs"></i>
            </Link>
            <Link
              to={`/invoice/orders/${order?._id}`}
              className="btn btn-success ms-2"
            >
              <i className="fa fa-print fa-xs"></i>
            </Link>
          </>
        ),
      });
    });

    return orders;
  };

  return (
    <>
      <h1 className="my-5">{data?.orders?.length} orders</h1>

      <MDBDataTable
        data={getOrders()}
        className="px-3"
        bordered
        striped
        hover
      />
    </>
  );
};

export default MyOrders;
