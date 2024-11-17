import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { loginUser } from "../../apiCalls/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

function LoginForm() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    let response = null;

    try {
      dispatch(showLoader());
      const response = await loginUser(user);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message, {
          style: {
            color: "green",
          },
        });
        localStorage.setItem("token", response.token);
        window.location.href = "/home";
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
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="input-group">
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              placeholder="Email..."
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              placeholder="Password..."
            />
          </div>

          <button type="submit">Login</button>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
