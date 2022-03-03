import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { DELETE } from '../../../assets';

interface DeleteToolProps {
  onPress: () => void;
  disabled: boolean;
  styles: any;
}

function DeleteTool({ onPress, disabled, styles }: DeleteToolProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.container}
      hitSlop={{
        top: 10, bottom: 10, left: 10, right: 10,
      }}
    >
      <Image
        source={DELETE}
        style={[styles.image, disabled && styles.disabled]}
      />
    </TouchableOpacity>
  );
}

export default DeleteTool;
