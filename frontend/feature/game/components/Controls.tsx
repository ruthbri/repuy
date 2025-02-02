import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { Losetas } from '../types';

interface GameControlsProps {
  tilesLeft: number;
  selectedTile: Losetas | null;
  onSelectedTilePress: (tile:Losetas) => void;
  onSettingsPress: () => void;
  onRulesPress: () => void;
}
const tile = require("../../../assets/images/logo-images/Tepuy-emblema-04.png");
const loseta = require("../../../assets/images/tiles-images/D1.png");

  export const GameControls = ({ tilesLeft,onSelectedTilePress, selectedTile, onSettingsPress, onRulesPress }: GameControlsProps) => (
  
  <View style={styles.container}>
    
    <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={onRulesPress}>
        <Ionicons name="book-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>

    <View style={styles.selectedTileContainer}>
      {selectedTile ? (
        <View style={[styles.selectedTile]} >
            <Image source={loseta}  style={{ width: 150, height: 150}} />
        </View>
      ) : (
        <View style={styles.emptyTile}>
          <Text>Sin selección</Text>
        </View>
      )}
    </View>

    <TouchableOpacity onPress={()=>{
        onSelectedTilePress({x:0, y:0, color: 'red',name: 'D1'});
    }} >
    <View style={styles.tilesDeck}>
      <View style={styles.deckBox}>
        <Image source={tile}  style={{ width: 90, height: 90}} />
      </View>
      <Text style={styles.deckLabel}>27/42</Text>
    </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '99%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  tilesDeck: {
    alignItems: 'center',
    width: 120
  },
  deckBox: {
    width: 100,
    height: 100,
    backgroundColor: '#E5DDA7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B2A46E',
    
  },
  deckCount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  deckLabel: {
    fontSize: 12,
    marginTop: 4
  },
  selectedTileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  selectedTile: {
    width: 150,
    height: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  emptyTile: {
    width: 150,
    height: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsContainer: {
    
   gap: 20
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  }
});
