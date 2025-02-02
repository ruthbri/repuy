import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import {
  Canvas,
  Rect,
  Group,
  Paint,
  LinearGradient,
  vec,
  Skia,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import { Player } from "../types";
import { PlayerScoreBar } from "./Headers";
import { GameControls } from "./Controls";

interface Losetas {
  x: number;
  y: number;
  color: string;
}

type Matrix = number[][];

const createMatrix = (rows: number, cols: number): Matrix => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

const playersArray: Player[] = [
  { id: 0, name: "Jugador 1", score: 0, color: "#FF4444", pawnsLeft: 7 },
  { id: 1, name: "Jugador 2", score: 0, color: "#44FF44", pawnsLeft: 7 },
  { id: 2, name: "Jugador 3", score: 0, color: "#4444FF", pawnsLeft: 7 },
  { id: 3, name: "Jugador 4", score: 0, color: "#F444FF", pawnsLeft: 7 },
];

export default function Game() {
  const title = require("../../../assets/images/logo-images/Tepuy-logo-02.png");

  const imageD1 = useImage(
    require("../../../assets/images/tiles-images/D1.png")
  );
  const [score, setScore] = useState(0);
  const myPlayerId = 2;
  const [players, setPlayers] = useState<Player[]>(playersArray);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [losetas, setLosetas] = useState<Losetas[]>([]);
  const { width, height } = Dimensions.get("window");
  const [gridSize, setGridSize] = useState(3);
  const [rows, setRows] = useState(3);
  const x = useSharedValue(0); // Coordenada X para el gesto
  const y = useSharedValue(0);
  const [selectedTile, setSelectedTile] = useState<Losetas | null>(null);

  const centerX = width / 2;

  const cellSize = useMemo(() => {
    return width / gridSize;
  }, [gridSize, width]);

  const canvasHeight = useMemo(() => {
    return cellSize * rows;
  }, [cellSize, rows]);
  const centerY = useMemo(() => {
    return canvasHeight / 2;
  }, [canvasHeight]);

  const gestureStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width,
    height: canvasHeight,
    backgroundColor: "rgba(0,0,0,0.1)",
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  const incresaseGridSize = (row: number, col: number) => {
    if (row === rows - 1 || col === gridSize - 1 || row === 0 || col === 0) {
      setRows((prevRows) => prevRows + 2);
      setGridSize((prevGridSize) => prevGridSize + 2);
    }
  };

  const handleLosetaPlacement = (rowp: number, colp: number) => {
    if (rowp < 0 || rowp >= rows || colp < 0 || colp >= gridSize) {
      return;
    }

    const x = colp - Math.floor(gridSize / 2);
    const y = rowp - Math.floor(rows / 2);

    const newLoseta: Losetas = {
      x,
      y,
      color: `rgb(${Math.random() * 255},${Math.random() * 255},${
        Math.random() * 255
      })`,
    };
    //console.log("newLoseta", newLoseta);
    const isOccupied = losetas.some(
      (tile) => tile.x === newLoseta.x && tile.y === newLoseta.y
    );
    //console.log("isOccupied", isOccupied);
    if (!isOccupied) {
      setLosetas((prevLosetas) => [...prevLosetas, newLoseta]);
      incresaseGridSize(rowp, colp);
    }
  };

  const gesture = Gesture.Pan().onTouchesDown((e) => {
    const colp = Math.floor(e.allTouches[0].x / cellSize);
    const rowp = Math.floor(e.allTouches[0].y / cellSize);

    // console.log("gesture", { rowp, colp });
    runOnJS(handleLosetaPlacement)(rowp, colp);
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          //justifyContent: "center",
          // alignItems: "center",

          //paddingVertical: 5,
          marginTop: 5,
        }}
      >
        <Image source={title} style={{ width: 150, height: 80 }} />
      </View>
      <PlayerScoreBar
        players={players}
        currentPlayer={currentPlayer}
        myPlayerId={myPlayerId}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "green",
        }}
      >
        <Canvas style={{ width, height: canvasHeight }}>
          <Group>
            <Rect x={0} y={0} width={width} height={canvasHeight}>
              <Paint>
                <LinearGradient
                  start={vec(0, 0)} // Inicio del degradado (arriba izquierda)
                  end={vec(0, canvasHeight)} // Fin del degradado (abajo izquierda)
                  colors={["#A0D54A", "#237D26"]} // Tonos de verde (oscuro a claro)
                />
              </Paint>
            </Rect>
          </Group>
          <Group>
            {losetas.map((loseta, index) => (
              //   <Rect
              //     key={index}
              //     x={centerX - cellSize / 2 + loseta.x * cellSize}
              //     y={centerY - cellSize / 2 + loseta.y * cellSize}
              //     width={cellSize}
              //     height={cellSize}
              //     color={loseta.color}
              //   >

              //   </Rect>
              <SkiaImage
                image={imageD1}
                x={centerX - cellSize / 2 + loseta.x * cellSize}
                y={centerY - cellSize / 2 + loseta.y * cellSize}
                width={cellSize}
                height={cellSize}
              />
            ))}
          </Group>
        </Canvas>
        <GestureDetector gesture={gesture}>
          <Animated.View style={gestureStyle} />
        </GestureDetector>
      </View>
      <View
        style={{
          height: 200,
          backgroundColor: "#f0f0f0",
          width: "100%",
          padding: 20,
        }}
      >
        <GameControls
          tilesLeft={7}
          selectedTile={selectedTile}
          onSelectedTilePress={(tile: Losetas) => setSelectedTile(tile)}
          onSettingsPress={() => {}}
          onRulesPress={() => {}}
        />
      </View>
    </View>
  );
}
