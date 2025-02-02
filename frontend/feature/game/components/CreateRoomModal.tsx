import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Player, useCreatePlayer, useCreateRoom, useJoinRoom } from "../hooks/useApiService";
import { router } from "expo-router";

interface CreateRoomModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [username, setUsername] = useState("");
  const {
    createRoom,
    loading: creatingRoom,
    error: createRoomError,
  } = useCreateRoom();
  const {
    createPlayer,
    loading: creatingplayer,
    error: createplayerError,
  } = useCreatePlayer();
  const {
    joinRoom,
    loading: joiningRoom,
    error: joinRoomError,
  } = useJoinRoom();

  const handleCreateAndJoinRoom = async () => {
    if (!username.trim()) {
      alert("Por favor, ingresa un nombre de usuario.");
      return;
    }

    try {
      // Crear la sala
      const { room_id } = await createRoom();
      console.log(`Sala creada con ID: ${room_id}`);
      const player:Player | { error: any; } = await createPlayer(username)
      console.log(`Jugador creado con ID: ${player}`);
      if (room_id && player) {
        // Unirse a la sala
        
        const response = await joinRoom(player._id, room_id);
        
        if (response.response) {
          alert(`Sala creada y unido con éxito. ID de sala: ${room_id}`);
          onClose();
          router.push(`/WaitingRoomScreen?roomId=${room_id}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Sala</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChangeText={setUsername}
          />
          <Button
            title={
              creatingRoom || joiningRoom ? "Procesando..." : "Crear y Unirse"
            }
            onPress={handleCreateAndJoinRoom}
            disabled={creatingRoom || joiningRoom}
          />
          {createRoomError && (
            <Text style={styles.errorText}>
              Error al crear sala: {createRoomError}
            </Text>
          )}
          {joinRoomError && (
            <Text style={styles.errorText}>
              Error al unirse: {joinRoomError}
            </Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#f00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CreateRoomModal;
