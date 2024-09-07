import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import IPFSImage from "../profile/IPFSImage";

const { width } = Dimensions.get("window");
const PADDING = 10;
const imageWidth = width * 0.65;

interface MyContestEntryProps {
  photo: {
    ipfsHash: string;
    username: string;
    timestamp: number;
    votes: number;
  } | null;
  onSelectPhoto: () => void;
}

export const MyContestEntry: React.FC<MyContestEntryProps> = ({
  photo,
  onSelectPhoto,
}) => {
  if (!photo) {
    return (
      <TouchableOpacity style={styles.uploadButton} onPress={onSelectPhoto}>
        <ThemedText style={styles.uploadButtonText}>
          Select Photo for Contest
        </ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Your Contest Entry</ThemedText>
      <View style={styles.cardContainer}>
        <IPFSImage ipfsHash={photo.ipfsHash} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.infoLeft}>
            <ThemedText style={styles.username}>{photo.username}</ThemedText>
            <ThemedText style={styles.timestamp}>
              {new Date(photo.timestamp * 1000).toLocaleDateString()}
            </ThemedText>
          </View>
          <ThemedText style={styles.votes}>{photo.votes} votes</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: imageWidth,
  },
  uploadButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cardContainer: {
    width: imageWidth,
    marginBottom: 20,
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  infoLeft: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  votes: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
});
