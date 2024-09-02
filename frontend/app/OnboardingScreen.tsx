import React from "react";
import { View, StyleSheet, ScrollView, Image, Button } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    console.log("handleGetStarted");
    router.replace("/LoginTest");
  };

  /* const handleGetStarted2 = () => {
    console.log("handleGetStarted2");
    router.replace("/Web3AuthApp");
  }; */

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../assets/images/real-you.jpg")}
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.title}>
          Welcome to Real You
        </ThemedText>
        <ThemedText style={styles.description}>
          Discover the power of authentic connections and meaningful
          interactions.
        </ThemedText>
        <View style={styles.featureContainer}>
          <FeatureItem
            icon="camera"
            title="Capture Moments"
            description="Share your real-time experiences with friends and family."
          />
          <FeatureItem
            icon="people"
            title="Connect Authentically"
            description="Build genuine relationships without filters or pretense."
          />
          <FeatureItem
            icon="shield-checkmark"
            title="Secure & Private"
            description="Your data is protected with state-of-the-art encryption."
          />
        </View>
      </ScrollView>
      <Button title="Get Started" onPress={handleGetStarted} />
      {/* <Button title="Get Started 2" onPress={handleGetStarted2} /> */}
    </ThemedView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color="#4A90E2" />
      <ThemedText type="subtitle" style={styles.featureTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.featureDescription}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 30,
  },
  featureContainer: {
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  featureTitle: {
    marginLeft: 10,
    fontWeight: "600",
  },
  featureDescription: {
    marginLeft: 34,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
  },
});
