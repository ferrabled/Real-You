import React from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import ImageGallery from "@/components/home/ImageGallery";
import ContestBanner from "@/components/home/ContestBanner";

const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ContestBanner />
      <ImageGallery />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});

export default Home;
