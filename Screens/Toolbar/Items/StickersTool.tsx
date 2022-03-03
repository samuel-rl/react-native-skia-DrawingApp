import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { STICKER } from '../../../assets';

interface StickersToolProps {
  onPress: (color: string) => void;
  selected: boolean;
  styles: any;
}

function StickersTool({ onPress, selected, styles }: StickersToolProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress('draw')}
      style={[selected && styles.selected, styles.container]}
      hitSlop={{
        top: 10, bottom: 10, left: 10, right: 10,
      }}
    >
      <Image source={STICKER} style={styles.image} />
    </TouchableOpacity>
  );
}

export default StickersTool;
