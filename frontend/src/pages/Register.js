import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";

const Register = () => {
  const navigate = useNavigate();
  const { openRegister } = useAuthModal();

  useEffect(() => {
    openRegister();
    navigate("/", { replace: true });
  }, [navigate, openRegister]);

  return null;
};

export default Register;
