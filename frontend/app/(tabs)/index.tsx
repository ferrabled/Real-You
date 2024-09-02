import React from "react";
import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
import ImageCard from "@/components/ImageCard";
import { ImageCardProps } from "@/types";

// Mock data for demonstration
const mockData = [
  {
    id: "1",
    imageUrl: "https://example.com/image1.jpg",
    description: "Beautiful sunset at the beach",
    username: "johndoe",
    timestamp: "2 hours ago",
    isVerified: true,
  },
  {
    id: "2",
    imageUrl: "https://example.com/image2.jpg",
    description: "City skyline at night",
    username: "janedoe",
    timestamp: "5 hours ago",
    isVerified: false,
  },
  // Add more mock items as needed
];

const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mockData.map((item) => (
          <ImageCard
            key={item.id}
            imageUrl={item.imageUrl}
            description={item.description}
            username={item.username}
            timestamp={item.timestamp}
            isVerified={item.isVerified}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 15,
  },
});

export default Home;
