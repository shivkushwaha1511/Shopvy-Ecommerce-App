import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import {
  useAdminProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApi";
import AdminLayout from "../layout/AdminLayout";

const ProductList = () => {
  const { data, isLoading, error } = useAdminProductsQuery();
  const [deleteProduct, { error: deleteError, isSuccess }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Product Deleted");
    }
  }, [error, isSuccess, deleteError]);

  if (isLoading) {
    return <Loader />;
  }

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
  };

  const getProducts = () => {
    const products = {
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
          label: "Stock",
          field: "stock",
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

    data?.products?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name.substring(0, 20)}...`,
        stock: product?.stock,
        actions: (
          <>
            <Link
              to={`/admin/products/${product?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil fa-xs"></i>
            </Link>
            <Link
              to={`/admin/products/${product?._id}/upload_image`}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-image fa-xs"></i>
            </Link>
            <button
              className="btn btn-outline-success ms-2"
              onClick={() => handleDeleteProduct(product?._id)}
            >
              <i className="fa fa-trash fa-xs"></i>
            </button>
          </>
        ),
      });
    });

    return products;
  };

  return (
    <AdminLayout>
      <h1 className="my-5">{data?.products?.length} products</h1>

      <MDBDataTable
        data={getProducts()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default ProductList;
