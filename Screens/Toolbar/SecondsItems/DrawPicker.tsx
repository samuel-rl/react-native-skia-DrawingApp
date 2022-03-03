import {
  Canvas, DashPathEffect, DiscretePathEffect, Line, Paint,
} from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { useDrawContext } from '../../Hooks/useDrawContext';
import { useUxContext } from '../../Hooks/useUxContext';
import { PathType } from '../../utils/types';

interface DrawPickerProps {
  style: ViewStyle;
}

interface DrawLinesProps {
  isSelected: boolean;
  type : PathType;
  onPress: (type: any) => void
}

function DrawLines({ isSelected, type, onPress }: DrawLinesProps) {
  return (
    <TouchableOpacity onPress={() => onPress(type)}>
      <Canvas
        style={[{ height: 50 }, isSelected && { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}
      >
        {type === 'dashed' && (
        <Paint style="stroke" strokeWidth={4}>
          <DashPathEffect intervals={[10, 10]} />
        </Paint>
        )}
        {type === 'discreted' && (
        <Paint>
          <DiscretePathEffect
            length={3}
            deviation={5}
          />
        </Paint>
        )}
        <Line
          p1={(ctx) => ({ x: 10, y: ctx.height / 2 })}
          p2={(ctx) => ({ x: ctx.width - 10, y: ctx.height / 2 })}
          strokeWidth={5}
          color="#000"
          strokeCap="round"
        />
      </Canvas>
    </TouchableOpacity>
  );
}

const pathTypes: PathType[] = ['normal', 'dashed', 'discreted'];

function DrawPicker({ style }: DrawPickerProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [visible, setVisible] = useState(uxContext.state.menu === 'drawing');
  const [pathTypeSelected, setPathTypeSelected] = useState(drawContext.state.pathType);

  useEffect(() => {
    const unsubscribeUx = uxContext.addListener((state) => {
      setVisible(state.menu === 'drawing');
    });
    const unsubscribeDraw = drawContext.addListener((state) => {
      setPathTypeSelected(state.pathType);
    });
    return () => {
      unsubscribeDraw();
      unsubscribeUx();
    };
  }, [drawContext, uxContext]);

  const onPress = (type: PathType) => {
    drawContext.commands.setPathType(type);
  };

  return visible ? (
    <View
      style={[style, styles.container]}
    >
      {
        pathTypes.map((type) => (
          <DrawLines
            key={type}
            isSelected={pathTypeSelected === type}
            type={type}
            onPress={onPress}
          />
        ))
      }
    </View>
  ) : null;
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    marginRight: 150,
  },
});

export default DrawPicker;
