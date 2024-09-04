import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Linking } from "react-native";
import { Web3AuthWrapper } from "@/components/web3Auth/Web3AuthWrapper";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import { ethers } from "ethers";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";

function LoginTestContent() {
  const { provider } = useContext(Web3AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {}, [provider]);

  const finishRegistration = async () => {
    if (!provider) {
      Alert.alert("Error", "Web3 provider not available");
      return;
    }

    try {
      setIsRegistering(true);
      const ethersProvider = new ethers.BrowserProvider(provider!);
      const privateKey = await provider.request({ method: "eth_private_key" });
      const wallet = new ethers.Wallet(privateKey);
      const signer = await wallet.connect(ethersProvider);

      console.log("User address", await signer.getAddress());

      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      Alert.alert(
        "Confirm Registration",
        "Do you want to complete your registration on the blockchain?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              console.log("FUNCTIONS", contract.getFunction("registerUser"));
              try {
                const tx = await contract.registerUser("TEST");
                const receipt = await tx.wait();
                const txHash = receipt.transactionHash;
                const explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`; // Assuming Sepolia network, change if different

                Alert.alert(
                  "Success",
                  `Registration completed successfully!\n\nTransaction Hash: ${txHash}\n\nView on Block Explorer:`,
                  [
                    { text: "OK" },
                    {
                      text: "View Transaction",
                      onPress: () => Linking.openURL(explorerUrl),
                    },
                  ]
                );
              } catch (error) {
                console.error("Transaction error:", error);
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                Alert.alert(
                  "Error",
                  `Failed to complete registration: ${errorMessage}`
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Failed to initiate registration");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logged In</Text>
      <Button
        title="Finish Registration"
        onPress={finishRegistration}
        disabled={isRegistering}
      />
    </View>
  );
}

export default function LoginTest() {
  return (
    <Web3AuthWrapper>
      <LoginTestContent />
    </Web3AuthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
