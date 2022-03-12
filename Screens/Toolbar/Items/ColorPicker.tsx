import {
  Canvas,
  canvas2Polar,
  Circle,
  Group,
  Paint,
  polar2Canvas,
  Shader,
  ShaderLib,
  Skia,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet, View, ViewStyle,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { useDrawContext } from '../../Hooks/useDrawContext';
import { useUxContext } from '../../Hooks/useUxContext';
import { polar2Color } from '../../utils/functions/helpers';

const COLOR_SIZE = {
  width: 30,
  height: 30,
  margin: 10,
};

const PICKER_VALUES = {
  max: 20,
  min: 1,
  margin: 1,
};

const PICKER_SIZE = {
  size: 200,
  margin: (PICKER_VALUES.max * 0.5) + 5 + PICKER_VALUES.margin * 4,
};

const TOTAL_PICKER_SIZE = PICKER_SIZE.size + PICKER_SIZE.margin * 2;

const source = Skia.RuntimeEffect.Make(`
uniform float2 c;
uniform float r;
${ShaderLib.Math}
${ShaderLib.Colors}
half4 main(vec2 uv) { 
  float mag = distance(uv, c);
  float theta = normalizeRad(canvas2Polar(uv, c).x);
  return hsv2rgb(vec3(theta/TAU, mag/r, 1.0));
}`)!;

interface ColorPickerProps {
  style: ViewStyle;
}

function ColorPicker({ style }: ColorPickerProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const translateX = useValue(100);
  const translateY = useValue(100);
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

  const temp = useMemo(() => PICKER_SIZE.size / 2 + PICKER_SIZE.margin, []);
  const center = useMemo(() => vec(temp, temp), []);
  const r = useMemo(() => PICKER_SIZE.size / 2, []);

  const colorWheelTouchHandler = useTouchHandler({
    onActive: (pt) => {
      const { theta, radius } = canvas2Polar(pt, center);
      const { x, y } = polar2Canvas(
        { theta, radius: Math.min(radius, r) },
        center,
      );
      translateX.current = x;
      translateY.current = y;
      drawContext.commands.setColor(polar2Color(theta, Math.min(radius, r), r));
    },
  });

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
          minimumValue={PICKER_VALUES.min}
          maximumValue={PICKER_VALUES.max}
          step={1}
          onValueChange={onValueChange}
        />
      </View>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',

      }}
      >
        <Canvas style={styles.colorWheel} onTouch={colorWheelTouchHandler}>
          <Paint>
            <Shader source={source} uniforms={{ c: center, r }} />
          </Paint>
          <Circle cx={center.x} cy={center.y} r={r} />
          <Group style="stroke" strokeWidth={5}>
            <Circle
              r={(currentSize * 0.5) + 5}
              color={currentBackgroundColor}
              cx={translateX}
              cy={translateY}
            />
          </Group>
          <Circle
            r={(currentSize * 0.5) + 5}
            color={currentColor}
            cx={translateX}
            cy={translateY}
          />
        </Canvas>
      </View>
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
  colorWheel: {
    width: TOTAL_PICKER_SIZE,
    height: TOTAL_PICKER_SIZE,
  },
});

export default ColorPicker;
