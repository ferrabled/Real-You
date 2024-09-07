import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import ImageCard from "./ImageCard";
import { ThemedText } from "../ThemedText";

const { width } = Dimensions.get("window");
const PADDING = 10;

interface Photo {
  id: string;
  ipfsHash: string;
  owner: string;
  username: string;
  timestamp: number;
}

export const ImageGallery: React.FC = () => {
  const { provider } = useContext(Web3AuthContext);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (provider) {
      fetchPhotos();
    }
  }, [provider]);

  const fetchPhotos = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const photoCount = await contract.photoCount();
      const fetchedPhotos = await contract.getAllPhotos(1, photoCount);

      const formattedPhotos = await Promise.all(
        fetchedPhotos.map(async (photo: any, index: number) => {
          const userProfile = await contract.getUserProfile(photo[0]);
          return {
            id: index.toString(),
            owner: photo[0],
            ipfsHash: photo[1],
            timestamp: Number(photo[2]),
            username: userProfile.username || "Unknown User",
          };
        })
      );

      // Sort the formattedPhotos in descending order based on timestamp
      const sortedPhotos = formattedPhotos.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setPhotos(sortedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  if (photos.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <ThemedText style={styles.emptyStateText}>
          No photos have been shared yet.
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gallery}>
        {photos.map((photo) => (
          <ImageCard
            key={photo.id}
            imageUrl={`https://ipfs.io/ipfs/${photo.ipfsHash}`}
            username={photo.username}
            timestamp={new Date(photo.timestamp * 1000).toLocaleString()}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: PADDING,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
  },
});

export default ImageGallery;
