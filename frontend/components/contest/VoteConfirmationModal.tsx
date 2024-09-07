import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "../ThemedText";
import IPFSImage from "../profile/IPFSImage";

const { width } = Dimensions.get("window");
const PADDING = 20;
const imageWidth = width * 0.8;

interface VoteConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  photo: {
    id: string;
    ipfsHash: string;
    username: string;
  };
}

export const VoteConfirmationModal: React.FC<VoteConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  photo,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.title}>Confirm Vote</ThemedText>
          <ThemedText style={styles.message}>
            Do you want to vote for this photo?
          </ThemedText>
          <IPFSImage ipfsHash={photo.ipfsHash} style={styles.image} />
          <View style={styles.usernameContainer}>
            <ThemedText style={styles.preusername}>
              📸 Real You moment by:
            </ThemedText>
            <ThemedText style={styles.username}>{photo.username}</ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <ThemedText style={styles.buttonText}>Confirm Vote</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: PADDING,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 10,
    marginBottom: 10,
  },
  preusername: {
    fontSize: 18,
    marginBottom: 20,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  usernameContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
