/* eslint-disable no-lonely-if */
import { useRef } from 'react';
import { useTouchHandler } from '@shopify/react-native-skia';
import type { SkPoint } from '@shopify/react-native-skia';

import { useDrawContext } from './useDrawContext';
import { useUxContext } from './useUxContext';
import { createPath } from '../utils/functions/path';
import { findClosestElementToPoint } from '../utils/functions/findClosestElementToPoint';
import { getBoundingBox } from '../utils/functions/getBoundingBox';
import { findResizeMode } from '../utils/functions/findResizeMode';
import { pointInRect } from '../utils/functions/pointInRect';
import { resizeElementsBy } from '../utils/functions/resizeElements';
import { findElementsInRect } from '../utils/functions/findElementsInRect';

export const useTouchDrawing = () => {
  const prevPointRef = useRef<SkPoint>();
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
        case 'selection': {
          const el = findClosestElementToPoint(
            { x, y },
            drawContext.state.elements,
          );

          if (el && drawContext.state.selectedElements.length === 0) {
            drawContext.commands.setSelectedElements(el);
            drawContext.commands.setSelectionRect(undefined);
            break;
          }

          const bounds = getBoundingBox(drawContext.state.selectedElements);

          if (bounds && pointInRect({ x, y }, bounds)) {
            drawContext.commands.setResizeMode(
              findResizeMode({ x, y }, drawContext.state.selectedElements),
            );
          } else {
            if (el) {
              drawContext.commands.setSelectedElements(el);
            } else {
              drawContext.commands.setSelectedElements();
              drawContext.commands.setSelectionRect({
                x,
                y,
                width: 0,
                height: 0,
              });
            }
          }
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
        case 'chooseSticker':
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
        case 'selection': {
          if (drawContext.state.selectedElements.length > 0) {
            resizeElementsBy(
              x - prevPointRef.current!.x,
              y - prevPointRef.current!.y,
              drawContext.state.resizeMode,
              drawContext.state.selectedElements,
            );
          } else {
            if (drawContext.state.currentSelectionRect) {
              drawContext.commands.setSelectionRect({
                x: drawContext.state.currentSelectionRect!.x,
                y: drawContext.state.currentSelectionRect!.y,
                width: x - drawContext.state.currentSelectionRect!.x,
                height: y - drawContext.state.currentSelectionRect!.y,
              });
            }
          }
          break;
        }
        default:
          break;
      }
      prevPointRef.current = { x, y };
    },
    onEnd: () => {
      switch (uxContext.state.menu) {
        case 'selection': {
          if (drawContext.state.currentSelectionRect) {
            const elements = findElementsInRect(
              drawContext.state.currentSelectionRect,
              drawContext.state.elements,
            );
            if (elements) {
              drawContext.commands.setSelectedElements(...elements);
            }
            drawContext.commands.setSelectionRect(undefined);
          }
          break;
        }
        default:
          break;
      }
    },
  });
};
