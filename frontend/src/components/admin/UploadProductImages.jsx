import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteImageMutation,
  useGetProductDetailsQuery,
  useUploadImagesMutation,
} from "../../redux/api/productApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UploadProductImages = () => {
  const params = useParams();
  const { data } = useGetProductDetailsQuery(params?.id);

  const [uploadImages, { error, isLoading, isSuccess }] =
    useUploadImagesMutation();

  const [deleteImage, { error: deleteError, isLoading: isDeleteLoading }] =
    useDeleteImageMutation();

  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);

  const product = data?.product;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      setPreviewImages([]);
      setImages([]);
    }
  }, [data, error, isSuccess, deleteError]);

  const handleUploadChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImages((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemovePreviewImage = (image) => {
    const filteredImages = previewImages?.filter((img) => img !== image);

    setPreviewImages(filteredImages);
    setImages(filteredImages);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    uploadImages({ id: params.id, body: { images } });
  };

  const handleDeleteImage = (imgId) => {
    deleteImage({ id: params.id, body: { imgId } });
  };
  return (
    <AdminLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8 mt-5 mt-lg-0">
          <form
            className="shadow rounded bg-body"
            enctype="multipart/form-data"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Upload Product Images</h2>

            <div className="mb-3">
              <label htmlFor="customFile" className="form-label">
                Choose Images
              </label>

              <div className="custom-file">
                <input
                  type="file"
                  name="product_images"
                  className="form-control"
                  id="customFile"
                  multiple
                  onChange={handleUploadChange}
                />
              </div>

              {previewImages?.length > 0 && (
                <div className="new-images my-4">
                  <p className="text-warning">New Images:</p>
                  <div className="row mt-4">
                    {previewImages.map((img) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            onClick={() => handleRemovePreviewImage(img)}
                            disabled={isLoading || isDeleteLoading}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? "Uploading" : "Upload"}
              </button>

              {product?.images.length > 0 && (
                <div className="uploaded-images my-4">
                  <p className="text-success">Product Uploaded Images:</p>
                  <div className="row mt-1">
                    {product?.images.map((img) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img?.url}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            type="button"
                            onClick={() => handleDeleteImage(img?.public_id)}
                            disabled={isDeleteLoading || isLoading}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>{" "}
    </AdminLayout>
  );
};

export default UploadProductImages;
