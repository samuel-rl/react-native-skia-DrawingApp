import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDrawContext } from '../Hooks/useDrawContext';
import { useUxContext } from '../Hooks/useUxContext';

function ModalConfirm() {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [visible, setVisible] = useState(uxContext.state.modalVisible);

  useEffect(() => {
    const unsubscribeUx = uxContext.addListener((state) => {
      setVisible(state.modalVisible);
    });
    return () => {
      unsubscribeUx();
    };
  }, [drawContext, uxContext]);

  const onPressYes = useCallback(() => {
    uxContext.commands.toggleMenu(undefined);
    drawContext.commands.deleteAllElements();
    uxContext.commands.toggleModal(false);
  }, []);

  const onPressNo = useCallback(() => {
    uxContext.commands.toggleModal(false);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
    >
      <View style={styles.containerFullSize}>
        <View style={styles.container}>
          <Text style={styles.mainText}>
            Delete all elements ?
          </Text>
          <View style={styles.containerButton}>
            <TouchableOpacity onPress={onPressNo}>
              <Text style={styles.textButton}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressYes}>
              <Text style={styles.textButton}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  containerFullSize: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    width: '80%',
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  textButton: {
    fontSize: 20,
    color: 'black',
  },
  mainText: {
    fontSize: 25,
    textAlign: 'center',
    paddingBottom: 40,
    color: 'black',
  },
});

export default ModalConfirm;
