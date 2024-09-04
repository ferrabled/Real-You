import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import IPFSImage from "./IPFSImage";

interface UserPhotoProps {
  ipfsHash: string;
  username: string;
}

const { width } = Dimensions.get("window");
const photoSize = width / 3 - 4; // 3 photos per row with 2px gap

export const UserPhoto: React.FC<UserPhotoProps> = ({ ipfsHash, username }) => {
  return (
    <View style={styles.container}>
      <IPFSImage ipfsHash={ipfsHash} style={styles.photo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: photoSize,
    height: photoSize,
    margin: 1,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});
