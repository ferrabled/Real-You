import React, { useEffect, useState, useContext } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { ContestTopic } from "@/components/contest/ContestTopic";
import { MyContestEntry } from "@/components/contest/MyContestEntry";
import { ContestEntries } from "@/components/contest/ContestEntries";
import { ContestLeaderboard } from "@/components/contest/ContestLeaderboard";
import { SelectPhotoModal } from "@/components/contest/SelectPhotoModal";
import { VoteConfirmationModal } from "@/components/contest/VoteConfirmationModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

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
      await fetchContestDetails();
    } catch (error) {
      console.error("Error voting for photo:", error);
      Alert.alert("Error", "Failed to vote for the photo. Please try again.");
    }
  };

  const handlePhotoSubmitted = async () => {
    await fetchContestDetails();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 40) },
      ]}
    >
      {contestDetails && (
        <ContestTopic
          topic={contestDetails.topic}
          endTime={contestDetails.endTime}
        />
      )}

      {contestId && <ContestLeaderboard contestId={contestId} />}

      <MyContestEntry
        photo={userPhoto}
        onSelectPhoto={() => setIsSelectPhotoModalVisible(true)}
      />

      <ContestEntries photos={contestPhotos} onVote={handleVoteClick} />

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
});

export default Contest;
