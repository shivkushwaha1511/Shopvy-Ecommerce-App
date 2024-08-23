import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userApi";

const UserList = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();
  const [deleteUser, { error: deleteError, isSuccess }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("User Deleted");
    }
  }, [error, deleteError, isSuccess]);

  if (isLoading) {
    return <Loader />;
  }

  const handleDeleteProduct = (id) => {
    deleteUser(id);
  };

  const getOrders = () => {
    const users = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
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

    data?.users?.forEach((user) => {
      users?.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        actions: (
          <>
            <Link
              to={`/admin/users/${user?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil fa-xs"></i>
            </Link>
            <button
              className="btn btn-outline-success ms-2"
              onClick={() => handleDeleteProduct(user?._id)}
            >
              <i className="fa fa-trash fa-xs"></i>
            </button>
          </>
        ),
      });
    });

    return users;
  };

  return (
    <AdminLayout>
      <h1 className="my-5">{data?.users?.length} users</h1>

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

export default UserList;
