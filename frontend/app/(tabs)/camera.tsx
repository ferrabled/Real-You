import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import UploadPrompt from "@/components/camera/UploadPrompt";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo!.uri);
      await savePhoto(photo!.uri);
      setShowUploadPrompt(true);
    }
  }

  async function savePhoto(uri: string) {
    try {
      if (Platform.OS === "web") {
        console.log("Photo captured (web):", uri);
      } else {
        console.log("Photo captured (mobile):", uri);
      }
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  }

  function handleUploadComplete() {
    setShowUploadPrompt(false);
    setCapturedImage(null);
  }

  function handleCancel() {
    setShowUploadPrompt(false);
    setCapturedImage(null);
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Ionicons
              name="camera-reverse"
              size={24}
              color="rgba(255, 255, 255, 0.7)"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
            <Ionicons name="camera" color="white" size={30} />
          </TouchableOpacity>
        </View>
      </CameraView>
      {showUploadPrompt && (
        <UploadPrompt
          imageUri={capturedImage}
          onUploadComplete={handleUploadComplete}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  flipButton: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 50,
  },
  cameraButton: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 50,
  },
});
