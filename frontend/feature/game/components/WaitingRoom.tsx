import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import {
  useGetRoom,
  usePlayersGame,
  useStartGame,
} from "../hooks/useApiService";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface WaitingRoomProps {
  roomId: string;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ roomId }) => {
  const { width, height } = useWindowDimensions();
  const { data, error, isLoading, mutate: refetch } = useGetRoom(roomId);
  const { startGame, loading: startingGame } = useStartGame();

  const handleStartGame = async () => {
    try {
      const { game_id } = await startGame(roomId);
      if (game_id) {
        console.log(`Juego iniciado con ID: ${game_id}`);

        Alert.alert("¡Éxito!", "El juego comenzará en breve...", [
          { text: "OK", style: "default" },
        ]);
        router.push(`/GameScreen?gameId=${game_id}`);
      }
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
      Alert.alert(
        "Error",
        "No se pudo iniciar el juego. Por favor, intenta de nuevo.",
        [{ text: "OK", style: "cancel" }]
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, height)}
              colors={["#1b5e20", "#4CAF50", "#1b5e20"]}
              positions={[0, 0.5, 1]}
            />
          </Rect>
        </Canvas>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Cargando sala de espera...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, height)}
              colors={["#1b5e20", "#4CAF50", "#1b5e20"]}
              positions={[0, 0.5, 1]}
            />
          </Rect>
        </Canvas>
        <Ionicons name="warning-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>
          No se pudo cargar la información de la sala
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={["#1b5e20", "#4CAF50", "#1b5e20"]}
            positions={[0, 0.5, 1]}
          />
        </Rect>
      </Canvas>

      <View style={styles.header}>
        <Text style={styles.title}>Sala de Espera</Text>
        <View style={styles.roomIdContainer}>
          <Text style={styles.roomIdLabel}>ID de la Sala:</Text>
          <Text style={styles.roomIdText}>{roomId}</Text>
        </View>
      </View>

      <View style={styles.playersSection}>
        <Text style={styles.playersTitle}>
          Jugadores Conectados: {data?.players.length || 0}
        </Text>
        <FlatList
          data={data?.players}
          keyExtractor={(item, index) => item}
          renderItem={({ item }) => (
            <View style={styles.playerCard}>
              <Ionicons name="person-circle-outline" size={24} color="#FFF" />
              <Text style={styles.playerName}>{item}</Text>
            </View>
          )}
          style={styles.playersList}
          contentContainerStyle={styles.playersListContent}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          (startingGame || data?.players.length < 1) &&
            styles.startButtonDisabled,
        ]}
        onPress={handleStartGame}
        disabled={startingGame || data?.players.length < 1}
      >
        <Ionicons name="play-circle-outline" size={24} color="#FFF" />
        <Text style={styles.startButtonText}>
          {startingGame ? "Iniciando juego..." : "Comenzar Juego"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  roomIdContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  roomIdLabel: {
    fontSize: 16,
    color: "#FFF",
    marginRight: 8,
  },
  roomIdText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  playersSection: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
  },
  playersTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  playersList: {
    flex: 1,
  },
  playersListContent: {
    padding: 10,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
    flex: 1,
  },
  startButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonDisabled: {
    backgroundColor: "rgba(255, 107, 107, 0.5)",
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default WaitingRoom;
