import React from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AuthRequiredPopupProps {
  visible: boolean;
  title: string;
  message: string;
  onLoginPress: () => void;
  onContinueGuestPress: () => void;
}

const AUTH_REQUIRED_ILLUSTRATION = require('../../../assets/login-required.jpeg');

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(328, SCREEN_WIDTH - 62);

export function AuthRequiredPopup({
  visible,
  title,
  message,
  onLoginPress,
  onContinueGuestPress,
}: AuthRequiredPopupProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={AUTH_REQUIRED_ILLUSTRATION} style={styles.illustration} resizeMode="cover" />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={onLoginPress} activeOpacity={0.9}>
            <Text style={styles.primaryText}>Log In / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onContinueGuestPress} activeOpacity={0.9}>
            <Text style={styles.secondaryText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(233, 233, 233, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  illustration: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 24,
  },
  title: {
    color: '#101828',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#344054',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    height: 45,
    borderRadius: 10,
    backgroundColor: '#4AAFD9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  secondaryButton: {
    height: 45,
    borderRadius: 10,
    backgroundColor: '#E6F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryText: {
    color: '#4AAFD9',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
});
