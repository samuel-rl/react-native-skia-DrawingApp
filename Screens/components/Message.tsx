import {
  Canvas,
  DashPathEffect,
  DiscretePathEffect,
  Fill,
  Group,
  Image,
  IRect,
  Paint,
  Path,
  Rect,
  SkiaView,
} from '@shopify/react-native-skia';
import React, {
  RefObject, useEffect, useMemo, useState,
} from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useDrawContext } from '../Hooks/useDrawContext';
import { useTouchDrawing } from '../Hooks/useTouchDrawing';
import { getBounds } from '../utils/functions/getBounds';
import { toColor } from '../utils/functions/toColor';
import { DrawingElement, DrawingElements } from '../utils/types';
import { SelectionFrame } from './SelectionFrame';

interface MessageProps {
  innerRef: RefObject<SkiaView>;
  style: StyleProp<ViewStyle>;
}

function Message({ innerRef, style }: MessageProps) {
  const drawContext = useDrawContext();
  const [elements, setElements] = useState(drawContext.state.elements);
  const [backgroundColor, setBackgroundColor] = useState(drawContext.state.backgroundColor);
  const [selectedElements, setSelectedElements] = useState<DrawingElements>();
  const [selectionRect, setSelectionRect] = useState<IRect>();

  const touchHandler = useTouchDrawing();

  useEffect(() => {
    const unsubscribeDraw = drawContext.addListener((state) => {
      setElements([...state.elements]);
      setBackgroundColor(state.backgroundColor);
      setSelectionRect(state.currentSelectionRect);
      setSelectedElements([...state.selectedElements]);
    });
    return () => {
      unsubscribeDraw();
    };
  }, [drawContext, innerRef]);

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
      {selectedElements ? (
        <SelectionFrame selectedElements={selectedElements} />
      ) : null}
      {selectionRect ? (
        <Group>
          <Paint style="stroke" strokeWidth={2} color="rgba(0, 0, 0, 1)">
            <DashPathEffect intervals={[4, 4]} />
          </Paint>
          <Rect
            color={toColor(backgroundColor, false) === '#000000' ? '#FFFFFF' : '#000000'}
            x={selectionRect.x}
            y={selectionRect.y}
            width={selectionRect.width}
            height={selectionRect.height}
          />
        </Group>
      ) : null}
    </Canvas>
  );
}

export default Message;
