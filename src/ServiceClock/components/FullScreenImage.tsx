import React, { useState } from 'react';
import { Modal, TouchableOpacity, Image, View, StyleSheet, Dimensions, ViewStyle, ImageStyle } from 'react-native';

interface FullScreenImageProps {
  uri: string;
  style?: ImageStyle;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ uri, style }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={openModal}>
        <Image source={{ uri }} style={[style]} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
        animationType="fade"
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <Image source={{ uri }} style={styles.fullScreenImage} />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
});

export default FullScreenImage;
