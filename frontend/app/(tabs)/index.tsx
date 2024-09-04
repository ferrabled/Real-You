import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ImageGallery from "@/components/home/ImageGallery";

const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
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
