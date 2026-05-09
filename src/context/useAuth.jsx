import { useContext } from "react";
import { AuthContext } from "./authContext";

// Custom hook to use the AuthContext
export  const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};