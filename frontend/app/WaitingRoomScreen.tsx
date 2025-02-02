import WaitingRoom from "@/feature/game/components/WaitingRoom";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";


const WaitingRoomScreen: React.FC = () => {
  const route = useRoute();
  const { params } = route as { params: { roomId: string } };
  const roomId = params?.roomId;

  return (
    <SafeAreaView style={styles.container}>
      <WaitingRoom roomId={roomId} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default WaitingRoomScreen;
