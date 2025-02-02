import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingModalProps {
    visible: boolean;
    message: string;
  }
  
export const LoadingModal: React.FC<LoadingModalProps> = ({ visible, message }) => (
    <Modal transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.modalText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      gap: 10
    },
    modalText: {
      fontSize: 16,
      marginTop: 10
    }
  });