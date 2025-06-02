import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../features/logoutSlice";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (token) {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp && Date.now() > decodedToken.exp * 1000) {
        dispatch(logout());
        return <Navigate to="/auth/farmer-login" />;
      }else{
        return children;
      }
    } catch (error) {
      dispatch(logout());
      console.error("Error decoding token:", error);
      return <Navigate to="/auth/farmer-login" />;
    }
  }else{
    dispatch(logout());
        return <Navigate to="/auth/farmer-login" />;
  }

 
};

export default ProtectedRoute;
