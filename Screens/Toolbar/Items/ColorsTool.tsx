import {
  Canvas, Line, vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { toColor } from '../../utils/functions/toColor';

interface ColorToolProps {
  styles: any;
  color: number;
  size: number;
  backgroundColor: number;
  onPress: (color: string) => void;
}

function ColorsTool({
  onPress, styles, color, size, backgroundColor,
}: ColorToolProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress('colors')}
      style={[
        styles.container,
        {
          backgroundColor: toColor(backgroundColor),
          borderRadius: 5,
        },
      ]}
      hitSlop={{
        top: 10, bottom: 10, left: 10, right: 10,
      }}
    >
      <Canvas style={styles.image}>
        <Line
          p1={vec(0, 0)}
          p2={vec(30, 30)}
          color={color}
          style="stroke"
          strokeWidth={size}
        />
      </Canvas>
    </TouchableOpacity>
  );
}

export default ColorsTool;
