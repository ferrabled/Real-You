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
        //const asset = await MediaLibrary.createAssetAsync(uri);
        //await MediaLibrary.createAlbumAsync("RealYou", asset, false);
        //console.log("Photo saved to RealYou album:", asset);
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
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Ionicons name="camera" color="white" size={30} />
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  flipButton: {
    position: "absolute",
    left: 20,
    bottom: 40,
    padding: 10,
  },
  cameraButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 200,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  cameraButton: {
    width: 90,
    height: 90,
    borderRadius: 35,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
