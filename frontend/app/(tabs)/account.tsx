import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { UserPhotoGallery } from "@/components/profile/UserPhotoGallery";
import { ThemedView } from "@/components/ThemedView";
import TagSubscription from "@/components/profile/tagSubscription";

export default function AccountScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
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
