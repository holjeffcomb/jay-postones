"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../../../types/types";

export interface GlobalContextType {
  isLoggingIn: boolean;
  setIsLoggingIn: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User;
  setUser: (value: User) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ firstName: "", lastName: "" });

  return (
    <GlobalContext.Provider
      value={{
        isLoggingIn,
        setIsLoggingIn,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
