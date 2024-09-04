import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { UserPhoto } from "./UserPhoto";
import { ThemedText } from "../ThemedText";

export const UserPhotoGallery: React.FC = () => {
  const { provider } = useContext(Web3AuthContext);
  const [userPhotos, setUserPhotos] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (provider) {
      fetchUserData();
    }
  }, [provider]);

  const fetchUserData = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      // Fetch user profile
      const userAddress = await signer.getAddress();
      const profile = await contract.users(userAddress);
      setUsername(profile.username);

      // Fetch user photos
      const photoCount = await contract.photoCount();
      const photos = await contract.getAllPhotos(1, photoCount);
      const userPhotos = photos.filter(
        (photo: any) => photo.owner === userAddress
      );
      setUserPhotos(userPhotos);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Your Photos</ThemedText>
      {userPhotos.length > 0 ? (
        <ScrollView horizontal={true} style={styles.scrollView}>
          {userPhotos.map((photo, index) => (
            <UserPhoto
              key={index}
              ipfsHash={photo.ipfsHash}
              username={username}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={styles.emptyStateText}>
            You haven't created any Real You moments yet.
          </ThemedText>
          <ThemedText style={styles.emptyStateSubText}>
            Tap the camera button to capture and share your authentic self!
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: "row",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyStateSubText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
