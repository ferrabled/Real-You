import React, { useState, useEffect, ReactNode } from "react";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  Button,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "../../globals";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import Web3Auth, {
  OPENLOGIN_NETWORK,
  LOGIN_PROVIDER,
  ChainNamespace,
} from "@web3auth/react-native-sdk";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const redirectUrl = Linking.createURL("(tabs)");

const clientId =
  "BAWUFTZNHcpFtCg1qS70gkqPNh5v4RGMXGQs79898sjQydka3M-L_tK5klBTJqCX00xJt0VM5L-7ESc95WZzvnM";

const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  decimals: 18,
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId,
  redirectUrl,
  network: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
});

interface Web3AuthWrapperProps {
  children: ReactNode;
}

export function Web3AuthWrapper({ children }: Web3AuthWrapperProps) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await web3auth.init();

      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        setProvider(ethereumPrivateKeyProvider);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async () => {
    try {
      console.log("Reinitializing Web3Auth");
      await web3auth.init();
      console.log("Web3Auth reinitialized");

      console.log("Login attempt started");
      console.log("web3auth ready:", web3auth.ready);

      if (!web3auth.ready) {
        console.error("Web3auth not initialized");
        return;
      }
      if (!email) {
        console.error("Enter email first");
        return;
      }

      console.log("Attempting login with email:", email);
      try {
        await web3auth.login({
          loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
          extraLoginOptions: {
            login_hint: email,
          },
        });
      } catch (loginError) {
        console.error("Web3Auth login error:", loginError);
        throw loginError;
      }
      if (web3auth.privKey) {
        console.log("Setting up provider");
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        console.log("Provider Set up");
        setProvider(ethereumPrivateKeyProvider);
        setLoggedIn(true);
      } else {
        console.log("No privKey found after login");
      }
    } catch (e: any) {
      console.error("Login error:", e);
      console.error("Error stack:", e.stack);
    }
  };

  const logout = async () => {
    if (!web3auth.ready) {
      console.error("Web3auth not initialized");
      return;
    }

    console.log("Logging out");
    await web3auth.logout();

    if (!web3auth.privKey) {
      setProvider(null);
      setLoggedIn(false);
      console.log("Logged out successfully");

      console.log("Reinitializing web3auth");
      await web3auth.init();
      console.log("Web3auth reinitialized");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonAreaLogin}>
          <TextInput
            style={styles.inputEmail}
            placeholder="Enter email"
            onChangeText={setEmail}
          />
          <Button title="Login with Web3Auth" onPress={login} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Web3AuthContext.Provider value={{ provider }}>
      {children}
      {loggedIn && (
        <TouchableOpacity style={styles.floatingButton} onPress={logout}>
          <Text style={styles.floatingButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </Web3AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  buttonAreaLogin: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  inputEmail: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
