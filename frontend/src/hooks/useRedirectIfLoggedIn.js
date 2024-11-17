import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { useEffect, useLayoutEffect } from "react";

export default function useRedirectIfLoggedIn() {
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate, isLoggedIn]);
}
