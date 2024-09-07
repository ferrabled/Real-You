import React from "react";
import { View, StyleSheet, ViewStyle, ImageStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import IPFSImage from "../profile/IPFSImage";

interface ImageCardProps {
  imageUrl: string;
  username: string;
  timestamp: string;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
}

const ImageContest: React.FC<ImageCardProps> = ({
  imageUrl,
  username,
  timestamp,
  containerStyle,
  imageStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <IPFSImage ipfsHash={imageUrl} style={[styles.image, imageStyle]} />
      <View style={styles.infoContainer}>
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.timestamp}>{timestamp}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 10,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
});

export default ImageContest;
