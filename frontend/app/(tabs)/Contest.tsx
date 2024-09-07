import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import ImageCard from "@/components/home/ImageCard";
import { ThemedText } from "@/components/ThemedText";
import { SelectPhotoModal } from "@/components/contest/SelectPhotoModal";
import { VoteConfirmationModal } from "@/components/contest/VoteConfirmationModal";
import { ContestLeaderboard } from "@/components/contest/ContestLeaderboard";

interface Photo {
  id: string;
  ipfsHash: string;
  owner: string;
  username: string;
  timestamp: number;
  votes: number;
}

interface ContestDetails {
  topic: string;
  endTime: number;
  photoIds: string[];
}

export const Contest: React.FC = () => {
  const { provider } = useContext(Web3AuthContext);
  const [contestId, setContestId] = useState<number | null>(null);
  const [contestDetails, setContestDetails] = useState<ContestDetails | null>(
    null
  );
  const [contestPhotos, setContestPhotos] = useState<Photo[]>([]);
  const [userPhoto, setUserPhoto] = useState<Photo | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isSelectPhotoModalVisible, setIsSelectPhotoModalVisible] =
    useState(false);
  const [isVoteModalVisible, setIsVoteModalVisible] = useState(false);
  const [selectedVotePhoto, setSelectedVotePhoto] = useState<Photo | null>(
    null
  );

  const ethersProvider = new ethers.BrowserProvider(provider);

  useEffect(() => {
    if (provider) {
      fetchContestDetails();
    }
  }, [provider]);

  const fetchContestDetails = async () => {
    try {
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const currentContestId = await contract.contestCount();
      setContestId(currentContestId);

      const details = await contract.getContestDetails(currentContestId);
      setContestDetails({
        topic: details.topic,
        endTime: Number(details.endTime),
        photoIds: details.photoIds.map((id: bigint) => id.toString()),
      });

      const address = await signer.getAddress();
      setUserAddress(address);

      const formattedPhotos = await Promise.all(
        details.photoIds.map(async (photoId: bigint) => {
          const photoDetails = await contract.getPhotoDetails(photoId);
          const userProfile = await contract.getUserProfile(photoDetails.owner);
          return {
            id: photoId.toString(),
            ipfsHash: photoDetails.ipfsHash,
            owner: photoDetails.owner,
            username: userProfile.username || "Unknown User",
            timestamp: Number(photoDetails.timestamp),
            votes: Number(photoDetails.votes),
          };
        })
      );

      const userPhotoIndex = formattedPhotos.findIndex(
        (photo) => photo.owner.toLowerCase() === address.toLowerCase()
      );
      if (userPhotoIndex !== -1) {
        setUserPhoto(formattedPhotos[userPhotoIndex]);
        setContestPhotos(
          formattedPhotos.filter((_, index) => index !== userPhotoIndex)
        );
      } else {
        setContestPhotos(formattedPhotos);
      }
    } catch (error) {
      console.error("Error fetching contest details:", error);
    }
  };

  const handleVoteClick = (photo: Photo) => {
    setSelectedVotePhoto(photo);
    setIsVoteModalVisible(true);
  };

  const handleVote = async () => {
    if (!selectedVotePhoto) return;

    try {
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const tx = await contract.voteForPhoto(selectedVotePhoto.id);
      await tx.wait();

      Alert.alert("Success", "Your vote has been recorded!");
      setIsVoteModalVisible(false);
      await fetchContestDetails(); // Refresh contest photos
    } catch (error) {
      console.error("Error voting for photo:", error);
      Alert.alert("Error", "Failed to vote for the photo. Please try again.");
    }
  };

  const handlePhotoSubmitted = async () => {
    await fetchContestDetails();
  };

  const formatTimeLeft = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    if (timeLeft <= 0) return "Contest ended";
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m left`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {contestDetails && (
        <View style={styles.contestInfo}>
          <ThemedText style={styles.contestTopic}>
            Topic: {contestDetails.topic}
          </ThemedText>
          <ThemedText style={styles.contestEndTime}>
            {formatTimeLeft(contestDetails.endTime)}
          </ThemedText>
        </View>
      )}
      {contestId && <ContestLeaderboard contestId={contestId} />}
      {userPhoto ? (
        <View>
          <ThemedText style={styles.sectionTitle}>
            Your Contest Entry
          </ThemedText>
          <View style={styles.cardContainer}>
            <ImageCard
              imageUrl={`https://ipfs.io/ipfs/${userPhoto.ipfsHash}`}
              username={userPhoto.username}
              timestamp={new Date(userPhoto.timestamp * 1000).toLocaleString()}
            />
            <ThemedText style={styles.voteCount}>
              Votes: {userPhoto.votes}
            </ThemedText>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setIsSelectPhotoModalVisible(true)}
        >
          <ThemedText style={styles.uploadButtonText}>
            Select Photo for Contest
          </ThemedText>
        </TouchableOpacity>
      )}

      <ThemedText style={styles.sectionTitle}>Contest Entries</ThemedText>
      <View style={styles.gallery}>
        {contestPhotos.map((photo) => (
          <View key={photo.id} style={styles.cardContainer}>
            <ImageCard
              imageUrl={`https://ipfs.io/ipfs/${photo.ipfsHash}`}
              username={photo.username}
              timestamp={new Date(photo.timestamp * 1000).toLocaleString()}
            />
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => handleVoteClick(photo)}
            >
              <ThemedText style={styles.buttonText}>
                Vote ({photo.votes})
              </ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <SelectPhotoModal
        isVisible={isSelectPhotoModalVisible}
        onClose={() => setIsSelectPhotoModalVisible(false)}
        onPhotoSubmitted={handlePhotoSubmitted}
        contestId={contestId!}
      />

      {selectedVotePhoto && (
        <VoteConfirmationModal
          isVisible={isVoteModalVisible}
          onClose={() => setIsVoteModalVisible(false)}
          onConfirm={handleVote}
          photo={selectedVotePhoto}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  contestInfo: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  contestTopic: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contestEndTime: {
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cardContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  voteButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  voteCount: {
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default Contest;
