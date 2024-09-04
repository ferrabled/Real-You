import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";

const { width } = Dimensions.get("window");
const CARD_PADDING = 10;
const IMAGE_SIZE = width - 50;

interface ImageCardProps {
  imageUrl: string;
  username: string;
  timestamp: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  username,
  timestamp,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.timestamp}>{timestamp}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: IMAGE_SIZE,
    marginBottom: CARD_PADDING,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

export default ImageCard;
