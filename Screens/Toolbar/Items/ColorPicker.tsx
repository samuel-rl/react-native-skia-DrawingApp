import {
  Skia,
} from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { CHECK } from '../../../assets';
import { useDrawContext } from '../../Hooks/useDrawContext';
import { useUxContext } from '../../Hooks/useUxContext';
import { toColor } from '../../utils/functions/toColor';

const COLOR_SIZE = {
  width: 30,
  height: 30,
  margin: 10,
};

const colors = [
  '#000000',
  '#FF0000',
  '#FF69B4',
  '#FFA500',
  '#FFFF00',
  '#008000',
  '#0000FF',
  '#A52A2A',
  '#FFFFFF',
];

interface ColorPickerProps {
  style: ViewStyle;
}

interface ColorComponentProps {
  color: string,
  onPress: (color: number) => void;
  isSelected: boolean;
  rounded: boolean;
}

function ColorComponent({
  color, onPress, isSelected, rounded,
}: ColorComponentProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(Skia.Color(color))}
      style={{
        backgroundColor: color,
        width: COLOR_SIZE.width,
        height: COLOR_SIZE.height,
        borderRadius: rounded ? COLOR_SIZE.width / 2 : 5,
        marginHorizontal: COLOR_SIZE.margin,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      hitSlop={{
        top: 10, bottom: 10, left: 10, right: 10,
      }}
    >
      {isSelected && (
        <Image
          source={CHECK}
          style={{
            width: COLOR_SIZE.width / 1.2,
            height: COLOR_SIZE.height / 1.2,
            tintColor: color === '#000000' ? '#fff' : '#000',
          }}
        />
      )}
    </TouchableOpacity>
  );
}

function ColorPicker({ style }: ColorPickerProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [currentColor, setCurrentColor] = useState(drawContext.state.color);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(
    drawContext.state.backgroundColor,
  );
  const [currentSize, setCurrentSize] = useState(drawContext.state.size);
  const [visible, setVisible] = useState(uxContext.state.menu === 'colors');

  useEffect(() => {
    const unsubscribeDraw = drawContext.addListener((state) => {
      setCurrentColor(state.color);
      setCurrentBackgroundColor(state.backgroundColor);
      setCurrentSize(state.size);
    });
    const unsubscribeUx = uxContext.addListener((state) => {
      setVisible(state.menu === 'colors');
    });
    return () => {
      unsubscribeDraw();
      unsubscribeUx();
    };
  }, [drawContext.state, uxContext]);

  const onValueChange = (newValue: number | number[]) => {
    drawContext.commands.setSize(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  return visible ? (
    <View style={[style, styles.container]}>
      <View style={{
        marginVertical: COLOR_SIZE.margin,
        marginHorizontal: COLOR_SIZE.margin,
        height: COLOR_SIZE.height,
      }}
      >
        <Slider
          value={currentSize}
          minimumValue={1}
          maximumValue={20}
          step={1}
          onValueChange={onValueChange}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginVertical: COLOR_SIZE.margin,
        }}
      >
        {colors.slice(0, -1).map((color) => (
          <ColorComponent
            isSelected={toColor(currentBackgroundColor, false) === color}
            key={color}
            color={color.toString()}
            onPress={drawContext.commands.setBackgroundColor}
            rounded
          />
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginVertical: COLOR_SIZE.margin,
        }}
      >
        {colors.map((color) => (
          <ColorComponent
            isSelected={toColor(currentColor, false) === color}
            key={color}
            color={color.toString()}
            onPress={drawContext.commands.setColor}
            rounded={false}
          />
        ))}
      </ScrollView>
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
  },
});

export default ColorPicker;
