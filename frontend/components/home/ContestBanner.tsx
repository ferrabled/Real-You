import React from "react";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "../ThemedText";

const { width } = Dimensions.get("window");

const ContestBanner: React.FC = () => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("Contest" as never);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <ThemedText style={styles.text}>Currently a contest ongoing</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width - 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ContestBanner;
