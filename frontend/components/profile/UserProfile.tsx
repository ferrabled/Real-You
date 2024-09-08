import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "react-native";
import { ethers } from "ethers";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { Web3AuthContext } from "@/context/Web3AuthContext";

interface UserData {
  username: string;
  reputation: number;
  exists: boolean;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { provider } = useContext(Web3AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const address = await signer.getAddress();

        const contract = new ethers.Contract(
          REALYOU_CONTRACT_ADDRESS,
          REALYOU_CONTRACT_ABI,
          signer
        );

        const result = await contract.getUserProfile(address);
        console.log(result);
        setUserData({
          username: result.username,
          reputation: result.reputation,
          exists: result.exists,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [provider]);

  if (!userData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/profilepic.png")}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.reputation}>
          Reputation: {Number(userData.reputation)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    gap: 4,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
  },
  reputation: {
    fontSize: 18,
    color: "#666",
  },
});

export default UserProfile;
