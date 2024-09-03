import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import { ethers } from "ethers";

const tags = [
  "Nature",
  "Food",
  "Travel",
  "Sports",
  "People",
  "Pets",
  "Art & Fashion",
]; // Example tags

const TagSubscription: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { provider } = useContext(Web3AuthContext);

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const handleSubscribe = async () => {
    if (selectedTag && provider) {
      try {
        const privateKey = await provider.request({
          method: "eth_private_key",
        });
        const wallet = new ethers.Wallet(privateKey);
        const currentTime = new Date().toISOString();
        const message = `XMTP : Subscribe to the ${selectedTag} tag
Current Time: ${currentTime}
From Address: ${wallet.address}
For more info: https://xmtp.org/signatures/`;

        const formattedMessage = message
          .split("\n")
          .map((line) => `• ${line}`)
          .join("\n");

        Alert.alert(
          `Confirm Subscription to ${selectedTag}`,
          `Do you want to receives updates of ${selectedTag} posts? XMTP clients will be able to send you messages when a new post with the ${selectedTag} tag is created.\n\nYou will be signing the following message:\n\n${formattedMessage}`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Accept & Sign",
              onPress: async () => {
                const signature = await wallet.signMessage(message);
                console.log("Subscription signed:", signature);
                console.log("Subscription signed by:", wallet.address);
                Alert.alert(
                  "Success",
                  `You have successfully subscribed to receive messages with the ${selectedTag} tag.\n\nYou will receive XMTP messages in your wallet: ${wallet.address.slice(
                    0,
                    6
                  )}...${wallet.address.slice(-4)}`,
                  [{ text: "OK" }]
                );
                // Here you would typically send this signature to your backend
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error("Failed to sign subscription:", error);
        Alert.alert("Error", "Failed to sign subscription");
      }
    } else if (!provider) {
      Alert.alert("Error", "Wallet not connected");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTag === tag && styles.selectedTag]}
            onPress={() => handleTagPress(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTag && (
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeButtonText}>
            Subscribe to {selectedTag}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  selectedTag: {
    backgroundColor: "#007AFF",
  },
  tagText: {
    color: "#333",
  },
  subscribeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  subscribeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TagSubscription;
