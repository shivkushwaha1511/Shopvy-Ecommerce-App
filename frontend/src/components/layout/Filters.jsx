import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceParams } from "../../helpers/helpers";
import { PRODUCT_CATEGORIES } from "../../constants/constant";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min"));
    searchParams.has("max") && setMax(searchParams.get("max"));
  }, []);

  // Handle Category & Ratings filter
  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      searchParams.delete(checkbox.name);
    } else {
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        searchParams.append(checkbox.name, checkbox.value);
      }
    }

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  // Handle price filter
  const handleSubmit = (e) => {
    e.preventDefault();

    searchParams = getPriceParams(searchParams, "min", min);
    searchParams = getPriceParams(searchParams, "max", max);

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  // handle Checkbox Default value
  const defaultCheckHandler = (checkBoxType, checkBoxValue) => {
    const value = searchParams.get(checkBoxType);
    if (checkBoxValue === value) return true;

    return false;
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form id="filter_form" className="px-2" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control border border-secondary"
              placeholder="Min (&#8377;)"
              name="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control border border-secondary"
              placeholder="Max (&#8377;)"
              name="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              GO
            </button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

      {PRODUCT_CATEGORIES.map((category) => (
        <div className="form-check">
          <input
            className="form-check-input border border-secondary"
            type="checkbox"
            name="category"
            id="check4"
            value={category}
            onClick={(e) => {
              handleClick(e.target);
            }}
            defaultChecked={defaultCheckHandler("category", category)}
          />
          <label className="form-check-label" htmlFor="check4">
            {category}
          </label>
        </div>
      ))}

      <hr />
      <h5 className="mb-3">Ratings</h5>

      {[5, 4, 3, 2, 1].map((rating) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings"
            id="check7"
            value={rating}
            onClick={(e) => {
              handleClick(e.target);
            }}
            defaultChecked={defaultCheckHandler("ratings", rating.toString())}
          />
          <label className="form-check-label" htmlFor="check7">
            <StarRatings
              rating={rating}
              starRatedColor="#ffb829"
              starDimension="21px"
              starSpacing="1px"
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filters;
