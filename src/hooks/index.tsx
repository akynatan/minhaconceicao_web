import React from "react";

import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;
