import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import { ThemedText } from "../ThemedText";
import IPFSImage from "../profile/IPFSImage";

interface LeaderboardEntry {
  photoId: number;
  votes: number;
  ipfsHash: string;
  owner: string;
  username: string;
}

interface ContestLeaderboardProps {
  contestId: number;
}

export const ContestLeaderboard: React.FC<ContestLeaderboardProps> = ({
  contestId,
}) => {
  const { provider } = useContext(Web3AuthContext);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (provider && contestId) {
      fetchLeaderboardData();
    }
  }, [provider, contestId]);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const leaderboard = await contract.getContestLeaderboard(contestId);
      console.log("Raw leaderboard data:", leaderboard);

      const [photoIds, voteCounts] = leaderboard;

      const formattedLeaderboard = await Promise.all(
        photoIds.map(async (photoId: bigint, index: number) => {
          const photoDetails = await contract.getPhotoDetails(photoId);
          const userProfile = await contract.getUserProfile(photoDetails.owner);
          const entry = {
            photoId: Number(photoId),
            votes: Number(voteCounts[index]),
            ipfsHash: photoDetails.ipfsHash,
            owner: photoDetails.owner,
            username: userProfile.username || "Unknown User",
          };
          console.log("Formatted entry:", entry);
          return entry;
        })
      );

      // Sort the leaderboard by votes in descending order
      formattedLeaderboard.sort((a, b) => b.votes - a.votes);
      console.log("Sorted leaderboard:", formattedLeaderboard);

      setLeaderboardData(formattedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Contest Leaderboard</ThemedText>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {leaderboardData.map((item, index) => (
          <View key={item.photoId} style={styles.leaderboardItem}>
            <ThemedText style={styles.rank}>{index + 1}</ThemedText>
            <IPFSImage ipfsHash={item.ipfsHash} style={styles.thumbnail} />
            <View style={styles.itemDetails}>
              <ThemedText style={styles.username}>{item.username}</ThemedText>
              <ThemedText style={styles.address}>{item.owner}</ThemedText>
              <ThemedText style={styles.votes}>
                Votes: {item.votes === 0 ? "No votes" : item.votes}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    width: 30,
    textAlign: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  votes: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
