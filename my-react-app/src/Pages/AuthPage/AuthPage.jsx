import React, { useState, useEffect } from "react";
import "./auth.css";
import Login from "../Login/Login";
import Regist from "../Requister/Regist";
import { useLocation, useNavigate } from "react-router-dom";

const AuthPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {

    if (location.state?.active !== undefined) {
      setActive(location.state.active);
    }

    if (location.state?.message) {
      setMessage(location.state.message);

      setTimeout(() => {
        setMessage("");
      }, 2000);

      navigate(location.pathname, { replace: true, state: {} });
    }

  }, [location.state, navigate, location.pathname]);

  return (
    <div className="body">
      <div className={`container ${active ? "active" : ""}`}>

        <div className="mobile-tabs">
          <button
            className={!active ? "active-tab" : ""}
            onClick={() => setActive(false)}
          >
            Login
          </button>
          <button
            className={active ? "active-tab" : ""}
            onClick={() => setActive(true)}
          >
            Register
          </button>
        </div>

        {/* Sign Up */}
        <div className="form-container sign-up">
          <Regist />
        </div>

        {/* Sign In */}
        <div className="form-container sign-in">
          <Login successMessage={message} />
        </div>

        {/* الجزء البنفسجي (Desktop بس) */}
        <div className="toggle-container">
          <div className="toggle">

            <div className="toggle-panel toggle-left">
              <h1 className="form-title">Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" onClick={() => setActive(false)}>
                Sign In
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1 className="form-title">Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" onClick={() => setActive(true)}>
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;