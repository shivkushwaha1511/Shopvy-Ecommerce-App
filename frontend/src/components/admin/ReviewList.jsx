import React, { useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import toast from "react-hot-toast";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteReviewMutation,
  useLazyGetReviewsQuery,
} from "../../redux/api/productApi";

const ReviewList = () => {
  const [productId, setProductId] = useState();

  const [getReviews, { data, isLoading, error }] = useLazyGetReviewsQuery();
  const [deleteReview, { error: deleteError, isSuccess }] =
    useDeleteReviewMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    getReviews(productId);
  };

  const handleDeleteReview = (id) => {
    deleteReview({ productId: productId, id: id });
  };

  const getReviewsData = () => {
    const reviews = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
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

    data?.reviews?.forEach((review) => {
      reviews?.rows.push({
        id: review?._id,
        rating: review?.rating,
        comment: review?.comment,
        user: review?.user?.name,
        actions: (
          <button
            className="btn btn-outline-success ms-2"
            onClick={() => handleDeleteReview(review?._id)}
          >
            <i className="fa fa-trash fa-xs"></i>
          </button>
        ),
      });
    });

    return reviews;
  };

  return (
    <AdminLayout>
      <div class="row justify-content-center my-5">
        <div class="col-6">
          <form onSubmit={submitHandler}>
            <div class="mb-3">
              <label for="productId_field" class="form-label">
                Enter Product ID
              </label>
              <input
                type="text"
                id="productId_field"
                class="form-control"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              class="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {data?.reviews.length > 0 ? (
        <MDBDataTable
          data={getReviewsData()}
          className="px-3"
          bordered
          striped
          hover
        />
      ) : (
        <p className="text-center">No Reviews</p>
      )}
    </AdminLayout>
  );
};

export default ReviewList;
