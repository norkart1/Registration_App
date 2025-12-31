import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface OtpPopupProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  email: string;
}

export const OtpPopup: React.FC<OtpPopupProps> = ({ visible, onClose, onVerify, email }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (otp.length === 6) {
      setIsVerifying(true);
      setMessage('Verifying...');
      try {
        const success = await onVerify(otp);
        if (success) {
          setMessage('Verification successful!');
          setTimeout(() => {
            onClose();
            setMessage('');
            setOtp('');
            setIsVerifying(false);
          }, 1500);
        } else {
          setMessage('Invalid OTP. Please try again.');
          setIsVerifying(false);
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
        setIsVerifying(false);
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Verification Code</Text>
          <Text style={styles.modalSubtitle}>
            We've sent a 6-digit code to {email}.
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            editable={!isVerifying}
          />

          {message ? (
            <Text style={[
              styles.message,
              message.includes('successful') ? styles.successMessage : styles.errorMessage
            ]}>
              {message}
            </Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={isVerifying}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.verifyButton, isVerifying && styles.disabledButton]} 
              onPress={handleVerify}
              disabled={isVerifying}
            >
              <Text style={styles.buttonText}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F3A70',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 4,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage: {
    color: '#28a745',
  },
  errorMessage: {
    color: '#dc3545',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  verifyButton: {
    backgroundColor: '#1F3A70',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
