import React, { useState, useEffect } from "react";
import { Image, ActivityIndicator, StyleSheet, View } from "react-native";

interface IPFSImageProps {
  ipfsHash: string;
  style?: object;
}

const IPFSImage: React.FC<IPFSImageProps> = ({ ipfsHash, style }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log("Fetching image from IPFS:", ipfsHash);
        let gatewayUrl = "";
        if (ipfsHash.startsWith("https://ipfs.io/ipfs/")) {
          gatewayUrl = ipfsHash;
        } else {
          gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        }
        // Fetch the image to check if it's available
        const response = await fetch(gatewayUrl);
        if (response.ok) {
          setImageUri(gatewayUrl);
        } else {
          console.error("Failed to fetch image from IPFS");
        }
      } catch (error) {
        console.error("Error fetching image from IPFS:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [ipfsHash]);

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  if (!imageUri) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={require("@/assets/images/real-you.jpg")}
          style={[styles.image, style]}
        />
      </View>
    );
  }

  return <Image source={{ uri: imageUri }} style={[styles.image, style]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light gray background for loading state
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default IPFSImage;
