import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [register, { isLoading, error }] = useRegisterMutation();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated]);

  const handleOnChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const { name, email, password } = user;

  const handleSubmit = (e) => {
    e.preventDefault();

    const registerData = { name, email, password };
    register(registerData);
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow rounded bg-body" onSubmit={handleSubmit}>
          <h2 className="mb-4">Register</h2>

          <div className="mb-3">
            <label for="name_field" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => {
                handleOnChange(e.target.name, e.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label for="email_field" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => {
                handleOnChange(e.target.name, e.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label for="password_field" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => {
                handleOnChange(e.target.name, e.target.value);
              }}
            />
          </div>

          <button
            id="register_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
