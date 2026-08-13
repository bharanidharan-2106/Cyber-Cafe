import React, { createContext, useContext, useState } from "react";

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);

  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal = () => setActiveModal(null);

  return (
    <AuthModalContext.Provider value={{ activeModal, openLogin, openRegister, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
};
