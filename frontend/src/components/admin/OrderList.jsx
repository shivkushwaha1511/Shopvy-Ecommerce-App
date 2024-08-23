import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/api/orderApi";

const OrderList = () => {
  const { data, isLoading, error } = useGetAdminOrdersQuery();
  const [deleteOrder, { error: deleteError, isSuccess }] =
    useDeleteOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Order Deleted");
    }
  }, [error, deleteError, isSuccess]);

  if (isLoading) {
    return <Loader />;
  }

  const handleDeleteOrder = (id) => {
    deleteOrder(id);
  };

  const getOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
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
      orders?.rows.push({
        id: order?._id,
        paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil fa-xs"></i>
            </Link>
            <button
              className="btn btn-outline-success ms-2"
              onClick={() => handleDeleteOrder(order?._id)}
            >
              <i className="fa fa-trash fa-xs"></i>
            </button>
          </>
        ),
      });
    });

    return orders;
  };

  return (
    <AdminLayout>
      <h1 className="my-5">{data?.orders?.length} orders</h1>

      <MDBDataTable
        data={getOrders()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default OrderList;
