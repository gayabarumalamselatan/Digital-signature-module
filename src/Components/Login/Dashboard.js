import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Create from "../Create";
import View from "../View";
import Report from "../Report";
import PdfViewer from "../Text Editor/PdfViewer";

function DashboardLog() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const storedUsername = sessionStorage.getItem("userName");
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div>
      <Create></Create>
      <br />
      <View />
      <br />
      <Report />
      <br />
      <PdfViewer />
    </div>
  );
}

export default DashboardLog;
