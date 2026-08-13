import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";

const Login = () => {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    openLogin();
    navigate("/", { replace: true });
  }, [navigate, openLogin]);

  return null;
};

export default Login;
