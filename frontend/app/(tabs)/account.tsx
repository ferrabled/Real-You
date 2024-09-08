import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { UserPhotoGallery } from "@/components/profile/UserPhotoGallery";
import { ThemedView } from "@/components/ThemedView";
import TagSubscription from "@/components/profile/tagSubscription";
import UserProfile from "@/components/profile/UserProfile";

export default function AccountScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <UserProfile />
        <TagSubscription />
        <UserPhotoGallery />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
