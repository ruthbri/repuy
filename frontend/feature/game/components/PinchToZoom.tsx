import React, { createContext, useContext, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Canvas, CanvasProps } from '@shopify/react-native-skia';

// Define el tipo para las propiedades del contexto
interface PinchZoomContextType {
  scale: Animated.SharedValue<number>;
}

// Crea el contexto con valores iniciales
const PinchZoomContext = createContext<PinchZoomContextType | null>(null);

// Define las propiedades del componente principal
interface PinchToZoomProps {
  children: ReactNode;
  style?: ViewStyle;
}

// Componente principal que maneja el gesto de pellizco (Pinch)
const PinchToZoom: React.FC<PinchToZoomProps> & {
  Canvas: React.FC<CanvasProps>;
} = ({ children, style }) => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onEnd(() => {
      scale.value = withTiming(1); // Restablecer escala al soltar
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: focalX.value },
      { translateY: focalY.value },
    ],
  }));
console.log("PinchToZoom",scale.value);
  return (
    <PinchZoomContext.Provider value={{ scale }}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={[style, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </PinchZoomContext.Provider>
  );
};

// Subcomponente: Canvas
const PinchZoomCanvas: React.FC<CanvasProps> = ({ style, ...props }) => {
  const context = useContext(PinchZoomContext);

  if (!context) {
    return null;
  }

  return (
    <Canvas style={style} {...props} />
  );
};

PinchToZoom.Canvas = PinchZoomCanvas;

// Exporta el componente
export default PinchToZoom;