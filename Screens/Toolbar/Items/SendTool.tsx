import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { SEND } from '../../../assets';

interface SendToolProps {
  onPress: () => void;
  styles: any;
}

function SendTool({ onPress, styles }: SendToolProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      hitSlop={{
        top: 10, bottom: 10, left: 10, right: 10,
      }}
    >
      <Image source={SEND} style={styles.image} />
    </TouchableOpacity>
  );
}

export default SendTool;
