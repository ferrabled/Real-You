import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { UserPhoto } from "./UserPhoto";
import { ThemedText } from "../ThemedText";
import LoadingPhotoGrid from "./LoadingPhotoGrid";

const { width } = Dimensions.get("window");
const PADDING = 5;
const GAP = 50;
const photoSize = (width - 2 * PADDING - GAP) / 2;

export const UserPhotoGallery: React.FC = () => {
  const { provider } = useContext(Web3AuthContext);
  const [userPhotos, setUserPhotos] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (provider) {
      fetchUserData();
    }
  }, [provider]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPhotoGrid />;
  }

  if (userPhotos.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <ThemedText style={styles.emptyStateText}>
          You haven't created any Real You moments yet.
        </ThemedText>
        <ThemedText style={styles.emptyStateSubText}>
          Tap the camera button to capture and share your authentic self!
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Your Photos</ThemedText>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.gallery}>
          {userPhotos.map((photo, index) => (
            <UserPhoto
              key={index}
              ipfsHash={photo.ipfsHash}
              username={username}
              style={styles.photo}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photo: {
    width: photoSize,
    height: photoSize,
    marginBottom: 10,
  },
  emptyStateContainer: {
    flex: 1,
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
