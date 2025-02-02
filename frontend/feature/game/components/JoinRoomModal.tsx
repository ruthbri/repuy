import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useJoinRoom } from "../hooks/useApiService";


interface JoinRoomModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isVisible, onClose }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const { joinRoom, loading: joiningRoom, error: joinRoomError } = useJoinRoom();

  const handleJoinRoom = async () => {
    try {
      await joinRoom(username, roomId);
      alert("Te has unido a la sala exitosamente.");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Unirse a una Sala</Text>
          <TextInput
            placeholder="Nombre de Usuario"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="ID de Sala"
            style={styles.input}
            value={roomId}
            onChangeText={setRoomId}
          />
          <Button
            title={joiningRoom ? "Uniéndose..." : "Unirse"}
            onPress={handleJoinRoom}
            disabled={joiningRoom}
          />
          {joinRoomError && <Text style={styles.errorText}>{joinRoomError}</Text>}
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
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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

export default JoinRoomModal;
