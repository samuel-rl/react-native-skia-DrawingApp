import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { PEN } from '../../../assets';

interface DrawToolProps {
  onPress: (color: string) => void;
  selected: boolean;
  styles: any;
}

function DrawTool({ onPress, selected, styles }: DrawToolProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress('draw')}
      style={[selected && styles.selected, styles.container]}
      hitSlop={{
        top: 10, bottom: 10, left: 10, right: 10,
      }}
    >
      <Image source={PEN} style={styles.image} />
    </TouchableOpacity>
  );
}

export default DrawTool;
