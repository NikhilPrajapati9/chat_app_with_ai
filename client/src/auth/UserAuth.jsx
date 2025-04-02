import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserAuth = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      setLoading(false);
    }

    if (!token) {
      navigate("/login");
    }

    if (!user) {
      navigate("/login");
    }
  }, [user, token,navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
