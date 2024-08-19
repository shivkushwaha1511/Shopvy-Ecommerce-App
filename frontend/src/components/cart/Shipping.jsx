import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import { saveShippingInfo } from "../../redux/features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState({ name: "India", countryCode: "IN" });
  const [state, setState] = useState("Madhya Pradesh");

  const countriesList = Object.values(Country.getAllCountries());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state?.cart);

  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo?.address);
      setPhoneNo(shippingInfo?.phoneNo);
      setCity(shippingInfo?.city);
      setCountry(shippingInfo?.country);
      setState(shippingInfo?.state);
      setZipCode(shippingInfo?.zipCode);
    }
  }, [shippingInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    const shippingData = {
      address,
      city,
      phoneNo,
      zipCode,
      country,
      state,
    };

    dispatch(saveShippingInfo(shippingData));
    navigate("/confirm_order");
  };

  return (
    <>
      <CheckoutSteps shipping />
      <div className="row wrapper mb-5">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Shipping Info</h2>
            <div className="mb-3">
              <label htmlFor="address_field" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="city_field" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone_field" className="form-label">
                Phone No
              </label>
              <input
                type="tel"
                id="phone_field"
                className="form-control"
                name="phoneNo"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="zip_code_field" className="form-label">
                Zip Code
              </label>
              <input
                type="number"
                id="zip_code_field"
                className="form-control"
                name="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="country_field" className="form-label">
                Country
              </label>
              <select
                id="country_field"
                className="form-select"
                name="country"
                required
                onChange={(e) => {
                  setCountry({
                    name: JSON.parse(e.target.value).name,
                    countryCode: JSON.parse(e.target.value).isoCode,
                  });
                }}
              >
                {countriesList.map((c) => {
                  return (
                    <option
                      key={c?.name}
                      value={JSON.stringify(c)}
                      selected={c?.name === country?.name ? "Selected" : null}
                    >
                      {c?.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="country_field" className="form-label">
                State
              </label>
              <select
                id="country_field"
                className="form-select"
                name="country"
                required
                onChange={(e) => {
                  setState(e.target.value);
                }}
              >
                {State.getStatesOfCountry(country.countryCode).map((c) => (
                  <option
                    key={c?.name}
                    value={c?.name}
                    selected={c?.name === state ? "Selected" : null}
                  >
                    {c?.name}
                  </option>
                ))}
              </select>
            </div>

            <button id="shipping_btn" type="submit" className="btn w-100 py-2">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
