import "bootstrap/dist/css/bootstrap.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "./axios";
// import Create from "../Create";
const login_url = "https://5z0e4.wiremockapi.cloud/auth-service/login";

const LoginPage = () => {
  const [loginError, setLoginError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const { setAuth } = useContext(AuthContext);
  const [errMsg, setErrMsg] = useState("");
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
    setLoginError(true);
  }, [userName, userPass]);

  useEffect(() => {
    // Check if the session is still active when the LoginPage component is rendered
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(login_url, JSON.stringify({ userName, userPass }), {
        Headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ userName, userPass, roles, accessToken });
      setUserName("");
      setUserPass("");
      setSuccess(true);
      navigate("/");
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
        setLoginError(true);
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
      {success ? (
        <div className="card">
          <div className="isloggedin"></div>
        </div>
      ) : (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="login-box">
            <p ref={errRef} className={errMsg ? "errmsg alert alert-danger" : "offscreen"} aria-live="assertive">
              {errMsg}
            </p>
            <div className="card card-primary">
              <div className="card-body">
                <form>
                  <h1 className="card-title">Welcome back!</h1>

                  <div className="input-group mb-3 user">
                    <input className="form-control" type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)} ref={userRef} value={userName} required />
                  </div>
                  <div className="input-group mb-3 pass">
                    <input className="form-control" type="Password" placeholder="Password" onChange={(e) => setUserPass(e.target.value)} value={userPass} />
                  </div>
                  <button onClick={handleSubmit} className="btn btn-primary" type="submit">
                    Login
                  </button>
                </form>
              </div>
            </div>
            <p>Kalo mw langsung edit/liat komponen, scroll aja.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
