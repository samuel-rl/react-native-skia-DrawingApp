import {
  Canvas, DashPathEffect, DiscretePathEffect, Fill, Group, Image, Paint, Path, SkiaView,
} from '@shopify/react-native-skia';
import React, {
  RefObject, useEffect, useMemo, useState,
} from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useDrawContext } from '../Hooks/useDrawContext';
import { useTouchDrawing } from '../Hooks/useTouchDrawing';
import { getBounds } from '../utils/functions/getBounds';
import { DrawingElement } from '../utils/types';

interface MessageProps {
  innerRef: RefObject<SkiaView>;
  style: StyleProp<ViewStyle>;
}

function Message({ innerRef, style }: MessageProps) {
  const drawContext = useDrawContext();
  const [elements, setElements] = useState(drawContext.state.elements);
  const [backgroundColor, setBackgroundColor] = useState(drawContext.state.backgroundColor);

  const touchHandler = useTouchDrawing();

  useEffect(
    () => drawContext.addListener((state) => {
      setElements([...state.elements]);
      setBackgroundColor(state.backgroundColor);
    }),
    [drawContext, innerRef],
  );

  const elementComponents = useMemo(() => elements.map((element: DrawingElement, index) => {
    switch (element.type) {
      case 'image':
        return (
          <Image
            fit="fill"
            key={index}
            image={element.image}
            rect={() => getBounds(element)}
          />
        );
      default:
        switch (element.pathType) {
          case 'discreted':
            return (
              <Group key={index}>
                <Paint style="stroke" strokeWidth={4}>
                  <DiscretePathEffect length={3} deviation={5} />
                </Paint>
                <Path
                  path={element.path}
                  color={element.color}
                  style="stroke"
                  strokeWidth={element.size}
                  strokeCap="round"
                />
              </Group>
            );
          case 'dashed':
            return (
              <Group key={index}>
                <Paint style="stroke" strokeWidth={4}>
                  <DashPathEffect intervals={[element.size * 2, element.size * 2]} />
                </Paint>
                <Path
                  path={element.path}
                  color={element.color}
                  style="stroke"
                  strokeWidth={element.size}
                  strokeCap="round"
                />
              </Group>
            );
          default:
            return (
              <Path
                key={index}
                path={element.path}
                color={element.color}
                style="stroke"
                strokeWidth={element.size}
                strokeCap="round"
              />
            );
        }
    }
  }), [elements]);

  return (
    <Canvas ref={innerRef} style={style} onTouch={touchHandler}>
      <Fill color={backgroundColor} />
      {elementComponents}
    </Canvas>
  );
}

export default Message;
