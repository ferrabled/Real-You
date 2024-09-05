import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { ethers } from "ethers";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import { EXPO_PUBLIC_PINATA_JWT } from "@env";

interface UploadPromptProps {
  imageUri: string | null;
  onUploadComplete: () => void;
  onCancel: () => void;
}

interface AnalysisResult {
  isPhotoreal: boolean;
  photoDescription: string;
  listOfTags: string[];
}

const UploadPrompt: React.FC<UploadPromptProps> = ({
  imageUri,
  onUploadComplete,
  onCancel,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [hash, setHash] = useState(null);
  const { provider } = useContext(Web3AuthContext);
  const [step, setStep] = useState<"initial" | "analysis" | "results">(
    "initial"
  );

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
      setHash(responseData.IpfsHash);
      return responseData.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      return null;
    }
  }

  async function analyzeImage(ipfsHash: string) {
    try {
      console.log("Analyzing image, hash: ", ipfsHash);
      const response = await fetch(
        "https://real-you-backend.vercel.app/api/gpt4vision.ts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ipfsUrl: ipfsHash }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
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
      throw error;
    }
  }

  async function handleAnalyze() {
    if (imageUri) {
      setIsUploading(true);
      try {
        const hash = await uploadToPinata(imageUri);
        if (hash) {
          const analysis = await analyzeImage(hash);
          setAnalysisResult({ ...analysis, ipfsHash: hash });
          setStep("analysis");
        }
      } catch (error) {
        console.error("Error during analysis:", error);
        // Handle error (show error message to user)
      } finally {
        setIsUploading(false);
      }
    }
  }

  async function handleFinalUpload() {
    if (analysisResult && hash) {
      setIsUploading(true);
      try {
        await uploadToContract(hash);
        onUploadComplete();
      } catch (error) {
        console.error("Error uploading to contract:", error);
        // Handle error (show error message to user)
      } finally {
        setIsUploading(false);
      }
    }
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {step === "initial" && (
          <>
            <Text style={styles.title}>Upload Photo?</Text>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.preview} />
            )}
            <Text style={styles.description}>
              Do you want to analyze this photo?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAnalyze}
                disabled={isUploading}
              >
                <Text style={styles.buttonText}>
                  {isUploading ? "Analyzing..." : "Analyze"}
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
          </>
        )}

        {step === "analysis" && (
          <>
            <Text style={styles.title}>Analysis Complete</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep("results")}
            >
              <Text style={styles.buttonText}>View Results</Text>
            </TouchableOpacity>
          </>
        )}

        {step === "results" && analysisResult && (
          <>
            <Text style={styles.title}>Analysis Results</Text>
            <Text style={styles.resultItem}>
              Is a real photo?: {analysisResult.isPhotoreal ? "Yes" : "No"}
            </Text>
            <Text style={styles.resultItem}>
              Description: {analysisResult.photoDescription}
            </Text>
            <Text style={styles.resultItem}>
              Tags: {analysisResult.listOfTags.join(", ")}
            </Text>
            <Text style={styles.question}>
              Do you want to upload this photo into RealYou?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleFinalUpload}
                disabled={isUploading}
              >
                <Text style={styles.buttonText}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const modalWidth = Math.min(width * 0.8, 400);
const imageAspectRatio = 3 / 4;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: modalWidth,
    alignItems: "center",
  },
  preview: {
    width: modalWidth - 40, // Subtracting padding
    height: (modalWidth - 40) / imageAspectRatio,
    borderRadius: 10,
    marginVertical: 15,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  resultItem: {
    fontSize: 14,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
});

export default UploadPrompt;
