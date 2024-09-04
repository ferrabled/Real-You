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
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("RealYou", asset, false);
        console.log("Photo saved to RealYou album:", asset);
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
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={styles.preview} />
      )}
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
    justifyContent: "center",
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
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  preview: {
    alignSelf: "center",
    width: 100,
    height: 100,
    margin: 10,
  },
});
