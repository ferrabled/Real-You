import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";

const { width } = Dimensions.get("window");
const PADDING = 5;
const GAP = 50;
const photoSize = (width - 2 * PADDING - GAP) / 2;

const LoadingPhotoGrid: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Your Photos</ThemedText>
      </View>
      <View style={styles.gridContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.loadingItem} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingItem: {
    width: photoSize,
    height: photoSize,
    marginBottom: 10,
    backgroundColor: "#E1E1E1", // Light gray color for loading state
  },
});

export default LoadingPhotoGrid;
