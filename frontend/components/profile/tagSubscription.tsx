import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import { ethers } from "ethers";
import { SUBSCRIPTIONS_ACCOUNTS } from "@/constants/SubscriptionsAccounts";
import {
  createConsentMessage,
  createConsentProofPayload,
} from "@xmtp/consent-proof-signature";
import { ThemedText } from "../ThemedText";

const tags = [
  "Nature",
  "Food",
  "Travel",
  "Sports",
  "People",
  "Pets",
  "Art & Fashion",
];

const TagSubscription: React.FC = () => {
  const [subscribedTags, setSubscribedTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { provider } = useContext(Web3AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchSubscribedTags();
  }, [provider]);

  const fetchSubscribedTags = async () => {
    if (provider) {
      try {
        setIsLoading(true);
        const privateKey = await provider.request({
          method: "eth_private_key",
        });
        const wallet = new ethers.Wallet(privateKey);

        const response = await fetch(
          `https://real-you-backend.vercel.app/api/userSubscriptions.ts?address=${wallet.address}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          if (Array.isArray(data.subscriptions)) {
            setSubscribedTags(data.subscriptions);
          } else {
            console.error("Unexpected data format:", data);
            setSubscribedTags([]);
          }
        } else {
          console.error("Failed to fetch subscribed tags");
          setSubscribedTags([]);
        }
      } catch (error) {
        console.error("Error fetching subscribed tags:", error);
        setSubscribedTags([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleTagPress = (tag: string) => {
    if (!subscribedTags.includes(tag)) {
      setSelectedTag(tag === selectedTag ? null : tag);
    }
  };

  const handleSubscribe = async () => {
    if (selectedTag && provider) {
      try {
        const privateKey = await provider.request({
          method: "eth_private_key",
        });
        console.log(privateKey);
        const wallet = new ethers.Wallet(privateKey);
        const currentTime = Date.now();
        //From address is the address that will send the messages
        //get it from SubscriptionsAccounts.ts
        const fromAddress =
          SUBSCRIPTIONS_ACCOUNTS[
            selectedTag as keyof typeof SUBSCRIPTIONS_ACCOUNTS
          ];

        const message = createConsentMessage(fromAddress, currentTime);

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
                const payloadBytes = createConsentProofPayload(
                  signature,
                  currentTime
                );
                const base64Payload =
                  Buffer.from(payloadBytes).toString("base64");
                const response = await fetch(
                  "https://real-you-backend.vercel.app/api/subscribe.ts",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      tag: selectedTag,
                      address: wallet.address,
                      signature: "base64Payload",
                      currentTime: currentTime,
                    }),
                  }
                );
                console.log("Response:", response);
                if (response.ok) {
                  Alert.alert(
                    "Success",
                    `You have successfully subscribed to receive messages with the ${selectedTag} tag.\n\nYou will receive XMTP messages in your wallet: ${wallet.address.slice(
                      0,
                      6
                    )}...${wallet.address.slice(-4)}`,
                    [{ text: "OK" }]
                  );
                  setSubscribedTags([...subscribedTags, selectedTag]);
                  setSelectedTag(null);
                } else {
                  const data = await response.json();
                  Alert.alert("Error", data.error);
                }
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.titleContainer}>
        <ThemedText style={styles.title}>Tag Subscriptions</ThemedText>
        <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View>
          <View style={styles.tagContainer}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  subscribedTags.includes(tag) && styles.subscribedTag,
                  selectedTag === tag && styles.selectedTag,
                ]}
                onPress={() => handleTagPress(tag)}
                disabled={subscribedTags.includes(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    (subscribedTags.includes(tag) || selectedTag === tag) &&
                      styles.selectedTagText,
                  ]}
                >
                  {tag}
                </Text>
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 21,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  expandIcon: {
    fontSize: 18,
    color: "#007AFF",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subscribedTag: {
    backgroundColor: "#4CAF50",
  },
  selectedTagText: {
    color: "white",
  },
});

export default TagSubscription;
