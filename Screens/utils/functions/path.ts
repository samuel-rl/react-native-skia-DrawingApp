import { Skia } from '@shopify/react-native-skia';
import { DrawingElement, PathType } from '../types';

export const createPath = (
  x: number,
  y: number,
  color: number,
  size: number,
  pathType: PathType,
): DrawingElement => {
  const path = Skia.Path.Make();
  path.moveTo(x, y);
  return {
    type: 'path',
    path,
    color,
    size,
    pathType,
  };
};
