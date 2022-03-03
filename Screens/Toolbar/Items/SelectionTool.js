import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {SELECTION} from '../../../assets';

const SelectionTool = ({onPress, selected, styles}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress('selection')}
      style={[selected && styles.selected, styles.container]}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Image source={SELECTION} style={styles.image} />
    </TouchableOpacity>
  );
};

export default SelectionTool;
