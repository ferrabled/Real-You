import React from "react";
import { TouchableOpacity, StyleSheet, Linking } from "react-native";
import { ThemedText } from "../ThemedText";

interface VerificationBadgeProps {
  isVerified: boolean;
  attestationLink: string | null;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  attestationLink,
}) => {
  const handleBadgePress = () => {
    if (attestationLink) {
      Linking.openURL(attestationLink);
    }
  };

  if (!isVerified) return null;

  return (
    <TouchableOpacity style={styles.badge} onPress={handleBadgePress}>
      <ThemedText style={styles.badgeText}>Verified</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 255, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});

export default VerificationBadge;
