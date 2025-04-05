import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/authSlice";
import axios from "../config/axios";
import { resetMessages } from "../store/messageSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LogoutBtn = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("/users/logout");
      console.log("logout", res);

      if (res.data.success) {
        localStorage.removeItem("token");
        dispatch(authLogout());
        dispatch(resetMessages());
        toast.success("Logout successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.warning("Logout failed");
    }
  };

  return (
    <Button
      className={`cursor-pointer bg-gray-600 ${className}`}
      onClick={handleLogout}
      title="Logout"
    >
      <LogOut />
    </Button>
  );
};

export default LogoutBtn;
