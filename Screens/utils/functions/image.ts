import type { IImage } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import { height, width } from '../constants';

import type { DrawingElement } from '../types';

export const createImage = (
  image: IImage,
): DrawingElement => {
  const path = Skia.Path.Make();
  path.addRect({
    x: (width / 2) - 50, y: (height / 4) - 50, width: 100, height: 100,
  });
  return {
    type: 'image',
    image,
    path,
  };
};
