/* eslint-disable react/function-component-definition */
import React, { useRef } from 'react';
import { Group, Rect, SkRect } from '@shopify/react-native-skia';

import { SelectionResizeHandle } from './SelectionHandle';
import { DrawingElements } from '../utils/types';
import { getBoundingBox } from '../utils/functions/getBoundingBox';

type Props = {
  selectedElements: DrawingElements;
};

const SelecctionHandleSize = 6;

export const SelectionFrame: React.FC<Props> = ({ selectedElements }) => {
  const boundingBoxRef = useRef<SkRect | undefined>(undefined);
  return selectedElements.length > 0 ? (
    <Group>
      {/** Rect around selected elements */}
      <Rect
        rect={() => {
          // Update the cached bounding box to avoid having to
          // recreate it every time.
          boundingBoxRef.current = getBoundingBox(selectedElements);
          return boundingBoxRef.current!;
        }}
        color="#4185F4"
        strokeWidth={2}
        style="stroke"
      />
      <Rect
        rect={() => boundingBoxRef.current!}
        color="#4185F418"
        style="fill"
      />
      {/** Resize handles */}
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x}
        y={() => boundingBoxRef.current!.y}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width}
        y={() => boundingBoxRef.current!.y}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height}
        size={SelecctionHandleSize}
      />
    </Group>
  ) : null;
};
