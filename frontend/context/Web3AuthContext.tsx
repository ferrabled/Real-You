import React, { createContext, useContext } from "react";

interface Web3AuthContextType {
  provider: any | null;
}

export const Web3AuthContext = createContext<Web3AuthContextType>({
  provider: null,
});

export const useWeb3Auth = () => useContext(Web3AuthContext);
