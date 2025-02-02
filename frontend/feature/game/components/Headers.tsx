import React from "react";
import { View, Text } from "react-native";
import { Player } from "../types";

interface PlayerScoreBarProps {
  players: Player[];
  currentPlayer: number;
  myPlayerId: number;
}
export const PlayerScoreBar = ({
  players,
  currentPlayer,
  myPlayerId=2,
}: PlayerScoreBarProps) => (
  <View
    style={{
       width: "99%", 
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      marginHorizontal: 5,
      marginVertical: 5,
      flexWrap: "wrap",
    }}
  >
    {players.map((player, index) => (
      <View
        key={player.id}
        style={{
          backgroundColor: currentPlayer === index ? "#e0e0e0" : "transparent",
          borderColor: myPlayerId === player.id ? player.color : "transparent",
          borderWidth: myPlayerId === player.id ? 1 : 0,
          flex: 1,
          minWidth: 150,
          maxWidth: '48%',
          padding: 10,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 2.5,

        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: player.color,
            marginRight: 5,
          }}
        />
        <View>
          <Text
            style={{ fontWeight: currentPlayer === index ? "bold" : "normal" }}
          >
            {player.id === myPlayerId ? `${player.name} (Tú)` : player.name}
          </Text>
          <Text style={{ fontSize: 12 }}>
            Score: {player.score} | Yanos: {player.pawnsLeft}
          </Text>
        </View>
      </View>
    ))}
  </View>
);
