import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import IPFSImage from "../profile/IPFSImage";

const { width } = Dimensions.get("window");
const PADDING = 4;
const GAP = 40;
const imageWidth = (width - 2 * PADDING - GAP) / 2;

interface Photo {
  id: string;
  ipfsHash: string;
  owner: string;
  username: string;
  timestamp: number;
  votes: number;
}

interface ContestEntriesProps {
  photos: Photo[];
  onVote: (photo: Photo) => void;
}

export const ContestEntries: React.FC<ContestEntriesProps> = ({
  photos,
  onVote,
}) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Contest Entries</ThemedText>
      <View style={styles.gallery}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.cardContainer}>
            <IPFSImage ipfsHash={photo.ipfsHash} style={styles.image} />
            <View style={styles.infoContainer}>
              <View style={styles.infoLeft}>
                <View style={styles.infoTop}>
                  <ThemedText style={styles.timestamp}>
                    🗓️ {new Date(photo.timestamp * 1000).toLocaleDateString()}
                  </ThemedText>
                  <View style={styles.infoBottom}>
                    <ThemedText style={styles.timestamp}>📸 </ThemedText>
                    <ThemedText style={styles.username}>
                      {photo.username}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.voteButton}
                onPress={() => onVote(photo)}
              >
                <ThemedText style={styles.buttonText}>Vote 🗳️</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    fontSize: 16,
  },
  timestamp: {
    fontSize: 14,
    color: "#888",
  },
  votes: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  infoTop: {
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-start",
    marginBottom: 5,
  },
  infoBottom: {
    flexDirection: "row",
    gap: 2,
  },
  voteButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 45,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
