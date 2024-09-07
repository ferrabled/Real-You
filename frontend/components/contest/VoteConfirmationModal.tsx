import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import IPFSImage from "../profile/IPFSImage";

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
          <ThemedText style={styles.username}>{photo.username}</ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
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
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
