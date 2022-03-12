import React, { useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native';
import Message from './components/Message';
import ModalConfirm from './components/ModalConfirm';
import { useDrawProvider } from './Hooks/useDrawProvider';
import { useUxProvider } from './Hooks/useUxProvider';
import ColorPicker from './Toolbar/Items/ColorPicker';
import DrawPicker from './Toolbar/SecondsItems/DrawPicker';
import StickerPicker from './Toolbar/SecondsItems/StickerPicker';
import Toolbar from './Toolbar/Toolbar';
import { TOOLBAR_MARGIN } from './utils/constants';

const createStyle = (width: number, height: number) => StyleSheet.create({
  container: {
    width,
    height,
  },
  message: {
    height: height / 2,
  },
  tools: {
    position: 'absolute',
    left: TOOLBAR_MARGIN,
    right: TOOLBAR_MARGIN,
    bottom: height * 0.10,
  },
  secondsTools: {
    position: 'absolute',
    left: TOOLBAR_MARGIN,
    right: TOOLBAR_MARGIN,
    bottom: height * 0.10 + 45 + 30,
  },
});

function DrawingScreen() {
  const skiaViewRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createStyle(width, height), [width, height]);

  const UxProvider = useUxProvider();
  const DrawProvider = useDrawProvider();

  return (
    <SafeAreaView style={styles.container}>
      <UxProvider>
        <DrawProvider>
          <Message innerRef={skiaViewRef} style={styles.message} />
          <Toolbar innerRef={skiaViewRef} style={styles.tools} />
          <DrawPicker style={styles.secondsTools} />
          <ColorPicker style={styles.secondsTools} />
          <StickerPicker style={styles.secondsTools} />
          <ModalConfirm />
        </DrawProvider>
      </UxProvider>
    </SafeAreaView>
  );
}

export default DrawingScreen;
