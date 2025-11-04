import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import { estiloTextos } from './misEstilos';
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraView } from 'expo-camera';

export default function App() {
  const [permisos, setPermisos] = useState(null);
  const [foto, setFoto] = useState(null);
  const [tipoCamera, setTipoCamera] = useState('back');
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();

      setPermisos(cameraStatus === "granted" && mediaStatus === "granted");

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert("Permisos requeridos", "Necesitas dar permisos de cámara y galería para usar esta app");
      }
    })();
  }, []);

  if (permisos === null) {
    return <View style={styles.loadingContainer}><Text style={estiloTextos.texto}>Cargando permisos...</Text></View>;
  }
  if (permisos === false) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text style={estiloTextos.texto}>Permisos denegados.</Text>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef) {
      try {
        const datosFoto = await cameraRef.takePictureAsync({ quality: 0.8 });
        setFoto(datosFoto.uri);

        const asset = await MediaLibrary.createAssetAsync(datosFoto.uri);
        console.log('Foto guardada en galeria', asset);

      } catch (error) {
        console.log('Error al tomar foto: ' + error);
        Alert.alert('Error', 'No se pudo tomar o guardar la foto.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={tipoCamera}
        ref={ref => setCameraRef(ref)}
      />

      <SafeAreaView style={styles.controlsContainer}>
        <View style={styles.bottomBar}>
          <View style={styles.thumbnailPlaceholder}>
              {foto && <Image style={styles.thumbnail} source={{ uri: foto }} />}
          </View>
          <TouchableOpacity style={styles.captureButtonOuter} onPress={tomarFoto}>
              <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setTipoCamera(current => (current === 'back' ? 'front' : 'back'))}>
              <Text style={styles.flipText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionDeniedContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomBar: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  captureButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'white',
  },
  thumbnailPlaceholder: {
    width: 45,
    height: 45,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipText: {
    fontSize: 22,
  }
});