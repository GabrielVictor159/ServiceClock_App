import React from 'react';
import { Modal, View, Text, FlatList, StyleSheet, Pressable, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useTheme } from '../provider/ThemeProvider';
import { createSelectDropdownModalStyle } from '../styles/Components/SelectDropdownModalStyle';

interface SelectDropdownModalProps {
  visible: boolean;
  options: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
}

const SelectDropdownModal: React.FC<SelectDropdownModalProps> = ({ visible, options, onSelect, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const styles = createSelectDropdownModalStyle(theme);
  return (
    <>
    {
        visible && (
          <View style={{ width:'100%', height:'100%', position: 'absolute', backgroundColor:'rgba(0,0,0,0.5)', top: 0, left: 0 }} />
        )
    }
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      style={styles.modal}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <FlatList
                data={options}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Pressable 
                    style={styles.item} 
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={styles.itemText}>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </>
  );
};

export default SelectDropdownModal;
