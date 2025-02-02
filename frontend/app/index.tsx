import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { GameLobby } from "@/feature/game/components/GameLobby";
import CreateRoomModal from "@/feature/game/components/CreateRoomModal";
import JoinRoomModal from "@/feature/game/components/JoinRoomModal";


export default function Home() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"createRoom" | "joinRoom" | null>(null);

  const openModal = (type: "createRoom" | "joinRoom") => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <GameLobby
          onCreateRoom={() => openModal("createRoom")}
          onJoinRoom={() => openModal("joinRoom")}
        />

        {/* Modal para Crear Sala */}
        {modalType === "createRoom" && (
          <CreateRoomModal isVisible={isModalVisible} onClose={closeModal} />
        )}

        {/* Modal para Unirse a Sala */}
        {modalType === "joinRoom" && (
          <JoinRoomModal isVisible={isModalVisible} onClose={closeModal} />
        )}
      </SafeAreaView>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    
  },
});
