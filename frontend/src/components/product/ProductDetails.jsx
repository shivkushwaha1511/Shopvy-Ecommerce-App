import React, { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/api/productApi";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../../redux/features/cartSlice";
import NewReview from "../review/NewReview";
import ReviewList from "../review/ReviewList";

const ProductDetails = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const params = useParams();
  const { data, isLoading, isError, error } = useGetProductDetailsQuery(
    params?.id
  );

  const product = data?.product;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }

    setActiveImage(
      product?.images[0]
        ? product?.images[0].url
        : "./images/default_product.png"
    );
  }, [isError, product]);

  if (isLoading) return <Loader />;

  const handleInc = () => {
    let qty = document.querySelector(".count").valueAsNumber;

    if (qty >= product?.stock) return;

    qty = qty + 1;

    setQuantity(qty);
  };

  const handleDec = () => {
    let qty = document.querySelector(".count").valueAsNumber;

    if (qty <= 1) return;

    qty = qty - 1;

    setQuantity(qty);
  };

  const handleAddToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      stock: product?.stock,
      image: product?.images
        ? product?.images[0]?.url
        : "./images/default_product.png",
      quantity,
    };

    dispatch(setCartItems(cartItem));
    toast.success("Item added to cart");
  };

  return (
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3">
          <img
            className="d-block w-100"
            src={activeImage}
            alt={product?.name}
            width="340"
            height="390"
          />
        </div>
        <div className="row justify-content-start mt-5">
          {product?.images?.map((img) => (
            <div className="col-2 ms-4 mt-2">
              <Link role="button">
                <img
                  className={`d-block border rounded p-3 cursor-pointer ${
                    activeImage === img.url ? "border-warning" : ""
                  }`}
                  height="100"
                  width="100"
                  src={img.url}
                  alt={img.url}
                  onClick={() => {
                    setActiveImage(img.url);
                  }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3>{product?.name}</h3>
        <p id="product_id">Product # {product?._id}</p>

        <hr />

        <div className="d-flex">
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#ffb829"
            starDimension="24px"
            starSpacing="1px"
          />
          <span id="no-of-reviews" className="pt-1 ps-2">
            ({product?.numOfReviews} Reviews)
          </span>
        </div>
        <hr />

        <p id="product_price">&#x20B9;{product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus" onClick={handleDec}>
            -
          </span>
          <input
            type="number"
            className="form-control count d-inline"
            value={quantity}
            readonly
            style={{ width: "80px" }}
          />
          <span className="btn btn-primary plus" onClick={handleInc}>
            +
          </span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          disabled={product?.stock <= 0}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status:
          <span
            id="stock_status"
            className={product?.stock > 0 ? "greenColor" : "redColor"}
          >
            {product?.stock > 0 ? "In Stock" : "Out Of Stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>{product?.description}</p>
        <hr />
        <p id="product_seller mb-3">
          Sold by: <strong>{product?.seller}</strong>
        </p>

        {isAuthenticated ? (
          <NewReview productId={params?.id} />
        ) : (
          <div className="alert alert-danger my-5" type="alert">
            Login to post your review.
          </div>
        )}
      </div>

      {product?.reviews?.length > 0 && <ReviewList reviews={product.reviews} />}
    </div>
  );
};

export default ProductDetails;
