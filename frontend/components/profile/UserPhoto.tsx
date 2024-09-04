import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import IPFSImage from "./IPFSImage";

interface UserPhotoProps {
  ipfsHash: string;
  username: string;
  style?: ViewStyle;
}

export const UserPhoto: React.FC<UserPhotoProps> = ({
  ipfsHash,
  username,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <IPFSImage ipfsHash={ipfsHash} style={styles.photo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  photo: {
    width: "100%",
    height: "100%",
  },
});
