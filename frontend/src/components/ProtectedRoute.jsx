import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useAuth from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {  token } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!token) {
      enqueueSnackbar("Please login to access this page", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      navigate("/login");
    }
  }, [token, navigate, enqueueSnackbar]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;