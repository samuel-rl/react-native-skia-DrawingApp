/* eslint-disable @typescript-eslint/no-unused-vars */
import { ImageFormat, SkiaView } from '@shopify/react-native-skia';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Share, StyleSheet, View, ViewStyle,
} from 'react-native';
import DrawTool from './Items/DrawTool';
import ColorsTool from './Items/ColorsTool';
import SelectionTool from './Items/SelectionTool';
import DeleteTool from './Items/DeleteTool';
import SendTool from './Items/SendTool';
import { TOOLBAR_HEIGHT } from '../utils/constants';
import { useUxContext } from '../Hooks/useUxContext';
import { useDrawContext } from '../Hooks/useDrawContext';
import StickersTool from './Items/StickersTool';

type ToolbarProps = {
  innerRef: React.RefObject<SkiaView>;
  style: ViewStyle;
};

function Toolbar({ innerRef, style }: ToolbarProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [activeTool, setActiveTool] = useState(uxContext.state.menu);
  const [color, setColor] = useState(drawContext.state.color);
  const [backgroundColor, setBackgroundColor] = useState(drawContext.state.backgroundColor);
  const [size, setSize] = useState(drawContext.state.size);
  const [haveElements, setHaveElements] = useState(
    drawContext.state.elements.length > 0,
  );

  useEffect(() => {
    const unsubscribeUx = uxContext.addListener((state) => {
      setActiveTool(state.menu);
    });
    const unsubscribeDraw = drawContext.addListener((state) => {
      setColor(state.color);
      setBackgroundColor(state.backgroundColor);
      setHaveElements(state.elements.length > 0);
      setSize(state.size);
    });
    return () => {
      unsubscribeDraw();
      unsubscribeUx();
    };
  }, [drawContext, uxContext]);

  const handleDrawingToolPressed = useCallback(() => {
    uxContext.commands.toggleMenu('drawing');
  }, [uxContext.commands]);

  const handleStickersPressed = useCallback(() => {
    uxContext.commands.toggleMenu('chooseSticker');
  }, [uxContext.commands]);

  const handleDelete = useCallback(() => {
    uxContext.commands.toggleMenu(undefined);
    drawContext.commands.deleteAllElements();
  }, [drawContext.commands, uxContext.commands]);

  const handleColorPressed = useCallback(() => {
    uxContext.commands.toggleMenu('colors');
  }, [uxContext.commands]);

  const handleSelectionPressed = useCallback(() => {
    uxContext.commands.toggleMenu('selection');
  }, [uxContext.commands]);

  const share = async () => {
    await drawContext.commands.cleanUseless();
    const image = innerRef.current?.makeImageSnapshot();
    if (image) {
      const data = image.encodeToBase64(ImageFormat.JPEG, 100);
      const url = `data:image/png;base64,${data}`;
      Share.share({
        url,
        title: 'Drawing',
      }).catch(() => {
        Alert.alert('An error occurred when sharing the image.');
      });
    } else {
      Alert.alert(
        'An error occurred when creating a snapshot of your drawing.',
      );
    }
  };

  return (
    <View style={[style, styles.container]}>
      <DrawTool
        selected={activeTool === 'drawing'}
        onPress={handleDrawingToolPressed}
        styles={toolsStyles}
      />
      <StickersTool
        selected={activeTool === 'chooseSticker'}
        onPress={handleStickersPressed}
        styles={toolsStyles}
      />
      <SelectionTool
        selected={activeTool === 'selection'}
        onPress={handleSelectionPressed}
        styles={toolsStyles}
      />
      <DeleteTool
        disabled={!haveElements}
        onPress={handleDelete}
        styles={toolsStyles}
      />
      <ColorsTool
        backgroundColor={backgroundColor}
        color={color}
        size={size}
        onPress={handleColorPressed}
        styles={toolsStyles}
      />
      <SendTool
        styles={toolsStyles}
        onPress={share}
      />
    </View>
  );
}

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
});

const toolsStyles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: TOOLBAR_HEIGHT - 5,
    height: TOOLBAR_HEIGHT - 5,
  },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.4,
  },
});
