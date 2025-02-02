import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingModal } from "./LoadingModal";
import { useNavigation, useRouter } from "expo-router";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";

const logo = require("../../../assets/images/logo-images/Tepuy-logo-02.png");
interface GameLobbyProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}
export const GameLobby: React.FC<GameLobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
}) => {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
  const [loadingState, setLoadingState] = useState<
    "none" | "creating" | "joining"
  >("none");

  const handleCreateRoom = () => {
   
    onCreateRoom();
   
    
  };

  const handleJoinRoom = () => {
   
    onJoinRoom();
  };
  return (
    <View style={styles.container}>
       <Canvas style={StyleSheet.absoluteFill}>
       <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(300, 300)}
            colors={['#1b5e20', '#4CAF50', '#1b5e20']}
            positions={[0, 0.5, 1]}
          />
        </Rect>
      </Canvas>  
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateRoom} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Crear Sala</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={handleJoinRoom} activeOpacity={0.8}>
          <Ionicons name="enter-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Unirse a Sala</Text>
        </TouchableOpacity>
      </View>

      <LoadingModal 
        visible={loadingState === 'creating'} 
        message="Creando sala..."
      />
      <LoadingModal 
        visible={loadingState === 'joining'} 
        message="Buscando sala..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "red",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  logo: {
    width: "80%",
    height: 300,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
