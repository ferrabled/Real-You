import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
  Text,
} from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { UserPhoto } from "../profile/UserPhoto";
import { ThemedText } from "../ThemedText";
import LoadingPhotoGrid from "../profile/LoadingPhotoGrid";

const { width } = Dimensions.get("window");
const PADDING = 5;
const GAP = 10;
const photoSize = (width - 2 * PADDING - 3 * GAP) / 3;

interface Photo {
  id: number;
  owner: string;
  ipfsHash: string;
  timestamp: number;
  isVerified: boolean;
  verificationCount: number;
  contestId: number;
}

interface SelectPhotoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhotoSubmitted: () => Promise<void>;
  contestId: number;
}

export const SelectPhotoModal: React.FC<SelectPhotoModalProps> = ({
  isVisible,
  onClose,
  onPhotoSubmitted,
  contestId,
}) => {
  const { provider } = useContext(Web3AuthContext);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (provider && isVisible) {
      fetchUserPhotos();
    }
  }, [provider, isVisible]);

  const fetchUserPhotos = async () => {
    try {
      setIsLoading(true);
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const userAddress = await signer.getAddress();
      const photoCount = await contract.photoCount();
      const photos = await contract.getAllPhotos(1, photoCount);
      console.log("allPhotos", photos);

      const userPhotos = photos
        .map((photo: any, index: number) => ({
          id: index + 1,
          owner: photo[0],
          ipfsHash: photo[1],
          timestamp: Number(photo[2]),
          isVerified: photo[3],
          verificationCount: Number(photo[4]),
          contestId: Number(photo[5]),
        }))
        .filter(
          (photo: any) =>
            photo.owner.toLowerCase() === userAddress.toLowerCase()
        );

      setUserPhotos(userPhotos);
    } catch (error) {
      console.error("Error fetching user photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsConfirmationVisible(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectedPhoto) return;

    setIsSubmitting(true);
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const tx = await contract.addPhotoToContest(selectedPhoto.id, contestId, {
        gasPrice: ethers.parseUnits("0.3", "gwei"),
        gasLimit: 151384,
      });
      await tx.wait();

      Alert.alert("Success", "Your photo has been submitted to the contest!");
      await onPhotoSubmitted();
      setIsConfirmationVisible(false);
      onClose();
    } catch (error) {
      console.error("Error submitting photo to contest:", error);
      Alert.alert(
        "Error",
        "Failed to submit photo to contest. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ThemedText style={styles.title}>Select a Photo for Contest</ThemedText>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ThemedText style={styles.closeButtonText}>Close</ThemedText>
        </TouchableOpacity>
        {isLoading ? (
          <LoadingPhotoGrid />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.gallery}>
              {userPhotos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoContainer}
                  onPress={() => handleSelectPhoto(photo)}
                >
                  <UserPhoto
                    ipfsHash={photo.ipfsHash}
                    username=""
                    style={styles.photo}
                  />
                  <Text>Index: {photo.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <Modal
        visible={isConfirmationVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationContent}>
            <ThemedText style={styles.confirmationTitle}>
              Confirm Contest Entry
            </ThemedText>
            <ThemedText style={styles.confirmationText}>
              Do you want to participate in the contest with the following
              photo?
            </ThemedText>
            {selectedPhoto && (
              <UserPhoto
                ipfsHash={selectedPhoto.ipfsHash}
                username=""
                style={styles.previewPhoto}
              />
            )}
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setIsConfirmationVisible(false)}
                disabled={isSubmitting}
              >
                <ThemedText style={styles.confirmationButtonText}>
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.confirmButton]}
                onPress={handleConfirmSelection}
                disabled={isSubmitting}
              >
                <ThemedText style={styles.confirmationButtonText}>
                  {isSubmitting ? "Submitting..." : "Confirm"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: "blue",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoContainer: {
    marginBottom: 10,
  },
  photo: {
    width: photoSize,
    height: photoSize,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmationContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  previewPhoto: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmationButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  confirmationButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
