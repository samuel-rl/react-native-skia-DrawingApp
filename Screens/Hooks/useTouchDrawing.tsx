import { useRef } from 'react';
import { useTouchHandler } from '@shopify/react-native-skia';
import type { IPoint } from '@shopify/react-native-skia';

import { useDrawContext } from './useDrawContext';
import { useUxContext } from './useUxContext';
import { createPath } from '../utils/functions/path';

export const useTouchDrawing = () => {
  const prevPointRef = useRef<IPoint>();
  const drawContext = useDrawContext();
  const uxContext = useUxContext();

  return useTouchHandler({
    onStart: ({ x, y }) => {
      switch (uxContext.state.menu) {
        case undefined:
        case 'drawing':
        case 'chooseSticker':
        case 'colors': {
          const { color, size, pathType } = drawContext.state;
          drawContext.commands.addElement(createPath(x, y, color, size, pathType));
          break;
        }
        default:
          break;
      }
      prevPointRef.current = { x, y };
    },
    onActive: ({ x, y }) => {
      switch (uxContext.state.menu) {
        case undefined:
        case 'drawing':
        case 'colors': {
          const element = drawContext.state.elements[drawContext.state.elements.length - 1];
          const xMid = (prevPointRef.current!.x + x) / 2;
          const yMid = (prevPointRef.current!.y + y) / 2;
          element.path.quadTo(
            prevPointRef.current!.x,
            prevPointRef.current!.y,
            xMid,
            yMid,
          );
          break;
        }
        default:
          break;
      }
      prevPointRef.current = { x, y };
    },
  });
};
