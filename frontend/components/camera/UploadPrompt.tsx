import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import { ethers } from "ethers";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import { EXPO_PUBLIC_PINATA_JWT } from "@env";

// Smart contract configuration (adjust these values as needed)

interface UploadPromptProps {
  imageUri: string | null;
  onUploadComplete: () => void;
  onCancel: () => void;
}

const UploadPrompt: React.FC<UploadPromptProps> = ({
  imageUri,
  onUploadComplete,
  onCancel,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { provider } = useContext(Web3AuthContext);

  async function uploadToPinata(uri: string) {
    try {
      const file = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      console.log("Uploading to Pinata");
      console.log(EXPO_PUBLIC_PINATA_JWT);
      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
      const data = new FormData();
      data.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_PINATA_JWT}`,
        },
        body: data,
      });

      const responseData = await response.json();
      console.log(responseData);
      return responseData.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      return null;
    }
  }

  async function uploadToContract(ipfsHash: string) {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );
      console.log("Uploading to contract");
      console.log(ipfsHash);
      const tx = await contract.uploadPhoto(ipfsHash);
      await tx.wait();
      console.log("Photo uploaded to contract successfully");
    } catch (error) {
      console.error("Error uploading to contract:", error);
    }
  }

  async function handleUpload() {
    if (imageUri) {
      setIsUploading(true);
      const hash = await uploadToPinata(imageUri);
      if (hash) {
        await uploadToContract(hash);
        onUploadComplete();
      }
      setIsUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photo?</Text>
      <Text style={styles.description}>
        Do you want to upload this photo to the RealYou system?
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpload}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>
            {isUploading ? "Uploading..." : "Upload"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default UploadPrompt;
