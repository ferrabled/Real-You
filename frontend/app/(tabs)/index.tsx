// app/index.tsx

import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ImageCard from '@/components/ImageCard';
import { ImageCardProps } from '@/types';

// Mock data for demonstration
const mockData = [
  {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    description: 'Beautiful sunset at the beach',
    username: 'johndoe',
    timestamp: '2 hours ago',
    isVerified: true,
  },
  {
    id: '2',
    imageUrl: 'https://example.com/image2.jpg',
    description: 'City skyline at night',
    username: 'janedoe',
    timestamp: '5 hours ago',
    isVerified: false,
  },
  // Add more mock items as needed
];

const Home: React.FC = () => {
  const renderItem = ({ item }: { item: ImageCardProps }) => (
    <ImageCard
      imageUrl={item.imageUrl}
      description={item.description}
      username={item.username}
      timestamp={item.timestamp}
      isVerified={item.isVerified}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    padding: 15,
  },
});

export default Home;