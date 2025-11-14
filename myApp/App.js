import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from "expo-media-library";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [foto, setFoto] = useState(null)
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef =useRef(null);
  const [facing, setFacing] = useState('back');

  useEffect(() => {
    (async () => {
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== "granted") {
        Alert.alert("Permisos", "Se necesitan permisos para guardar fotos.");
      }
      await requestPermission();
    })();

    const timer = setTimeout(() => setIsSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <LinearGradient
        colors={["#0c0a14", "#1e1a33", "#3a325e"]}
        style={styles.splashContainer}
      >
        <Image
          source={require("./assets/This is the skin of a killer Bella.jpg")}
          style={{ width: "90%", height: "90%", marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>This is the skin of a killer,Bella</Text>
      </LinearGradient>
    );
  }

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No se concedieron permisos para la camara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Conceder permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photoData) {
          setFoto(photoData.uri);
          console.log("Foto tomada:", photoData.uri);

          await MediaLibrary.saveToLibraryAsync(photoData.uri);
          Alert.alert("Exito", "Foto guardada en la galeria.");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo tomar o guardar la foto.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
      </View>

      <SafeAreaView style={styles.controlsContainer}>
        <View style={styles.bottomBar}>

          <View style={styles.thumbnailPlaceholder}>
            {foto && <Image style={styles.thumbnail} source={{ uri: foto }} />}
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
          >
            <Text style={styles.flipText}>Girar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    color: "#BD93BD",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0a14',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BD93BD',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraContainer: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomBar: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnailPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#777',
  },
  thumbnail: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
  },
  flipButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipText: {
    fontSize: 20,
    color: 'white',
  },
});