import React, { useState } from "react";
import "./signup.css"; // Import the CSS
import { Link } from "react-router-dom";
import { signupUser } from "../../apiCalls/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

const SignupForm = () => {
  const dispatch = useDispatch();
  const [user, setuser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let response = null;
    try {
      dispatch(showLoader());
      response = await signupUser(user);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message, {
          style: {
            color: "green",
          },
        });
      } else {
        toast.error(response.message, {
          style: {
            color: "red",
          },
        });
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(response.message, {
        style: {
          color: "red",
        },
      });
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create an Account</h2>

          <div className="form-group">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={user.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={user.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>

          <p className="redirect">
            Already have an account? <Link to="/login">Click here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
