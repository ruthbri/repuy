
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Stack } from "expo-router";

import Game from "@/feature/game/components/Game";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";


export default function GameView() {
  const {params}=useRoute();
  console.log(params);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <GestureHandlerRootView style={styles.container}>
           <Game /> 
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
