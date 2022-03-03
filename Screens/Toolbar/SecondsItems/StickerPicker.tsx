import { useImage } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet, TouchableOpacity, View, ViewStyle, Image,
} from 'react-native';
import {
  COCONUT,
  DRINK,
  ICE_CREAM,
  LEMON,
  CRAB,
  SUMMER,
  SUN,
  WHALE,
  LEMONADE,
  FISH,
  OCTOPUS,
  WATERMELON,
} from '../../../assets/stickers';
import { useDrawContext } from '../../Hooks/useDrawContext';
import { useUxContext } from '../../Hooks/useUxContext';
import { createImage } from '../../utils/functions/image';

interface StickerPickerProps {
  style: ViewStyle;
}
const data = [
  COCONUT,
  DRINK,
  ICE_CREAM,
  LEMON,
  CRAB,
  SUMMER,
  SUN,
  WHALE,
  LEMONADE,
  FISH,
  OCTOPUS,
  WATERMELON,
];

function Sticker({ item, onPress }: any) {
  const image = useImage(item);
  return (
    <TouchableOpacity
      onPress={() => onPress(image)}
      style={{
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}
    >
      <Image
        source={item}
        style={{
          width: '80%',
          height: undefined,
          aspectRatio: 1,
        }}
      />
    </TouchableOpacity>
  );
}

function StickerPicker({ style }: StickerPickerProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [visible, setVisible] = useState(uxContext.state.menu === 'chooseSticker');

  useEffect(() => {
    const unsubscribeUx = uxContext.addListener((state) => {
      setVisible(state.menu === 'chooseSticker');
    });
    return () => {
      unsubscribeUx();
    };
  }, [drawContext, uxContext]);

  const onPress = (item: any) => {
    drawContext.commands.addElement(
      createImage(item),
    );
    uxContext.commands.toggleMenu(undefined);
  };

  return visible ? (
    <View
      style={[style, styles.container]}
    >
      <FlatList
        data={data}
        numColumns={4}
        renderItem={({ item }) => <Sticker onPress={onPress} item={item} />}
        keyExtractor={(_, index) => index.toString()}
      />
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
    height: 175,
  },
});

export default StickerPicker;
