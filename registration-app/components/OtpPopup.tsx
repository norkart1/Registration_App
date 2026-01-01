import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

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
  const [showTestOTP, setShowTestOTP] = useState(false);

  const handleVerify = async () => {
    console.log('Verifying OTP:', otp);
    if (otp.length === 6) {
      setIsVerifying(true);
      setMessage('Verifying...');
      try {
        const success = await onVerify(otp);
        console.log('Verification success:', success);
        if (success) {
          setMessage('Verification successful!');
          setTimeout(() => {
            onClose();
            setMessage('');
            setOtp('');
            setIsVerifying(false);
            setShowTestOTP(false);
          }, 1500);
        } else {
          setMessage('Invalid code. Please try again.');
          setIsVerifying(false);
        }
      } catch (error: any) {
        console.error('Verify handler error:', error);
        setMessage(error.message || 'Verification failed. Please try again.');
        setIsVerifying(false);
      }
    } else {
      Alert.alert('Error', 'Please enter a 6-digit code');
    }
  };

  const handleShowTestOTP = () => {
    setShowTestOTP(!showTestOTP);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Verify Your Email</Text>
          <Text style={styles.modalSubtitle}>
            We've sent a 6-digit verification code to {email}. Enter the code below to verify your account.
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus={true}
              editable={!isVerifying}
            />
          </View>

          {message ? (
            <Text style={[
              styles.message,
              message.includes('successful') ? styles.successMessage : styles.errorMessage
            ]}>
              {message}
            </Text>
          ) : null}

          {showTestOTP && (
            <View style={styles.testOtpBox}>
              <Text style={styles.testOtpLabel}>Development Mode - Test Code:</Text>
              <Text style={styles.testOtpCode}>Check browser console for OTP</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={isVerifying}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.verifyButton, (!otp || isVerifying) && styles.disabledButton]} 
              onPress={handleVerify}
              disabled={!otp || isVerifying}
            >
              <Text style={styles.buttonText}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={handleShowTestOTP}
            style={styles.helpLink}
          >
            <Text style={styles.helpLinkText}>
              {showTestOTP ? 'Hide help' : 'Need help?'}
            </Text>
          </Pressable>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
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
    zIndex: 9999,
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
  inputContainer: {
    width: '100%',
    marginBottom: 10,
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
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
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
  testOtpBox: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#1F3A70',
  },
  testOtpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F3A70',
    marginBottom: 4,
  },
  testOtpCode: {
    fontSize: 13,
    color: '#666',
  },
  helpLink: {
    marginTop: 15,
    paddingVertical: 8,
  },
  helpLinkText: {
    fontSize: 12,
    color: '#1F3A70',
    fontWeight: '600',
  },
});
