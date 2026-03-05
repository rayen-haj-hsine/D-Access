import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LocationPinIcon } from '../icons/LocationPinIcon';
import { VerifiedBadgeIcon } from '../icons/VerifiedBadgeIcon';

type PopupVariant = 'location' | 'verified';

interface AuthStatusPopupProps {
  visible: boolean;
  variant: PopupVariant;
  title: string;
  message: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(328, SCREEN_WIDTH - 62);

export function AuthStatusPopup({
  visible,
  variant,
  title,
  message,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: AuthStatusPopupProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.contentWrap}>
            <View style={[styles.iconCircle, variant === 'location' ? styles.locationCircle : styles.verifiedCircle]}>
              {variant === 'location' ? <LocationPinIcon /> : <VerifiedBadgeIcon />}
            </View>

            <Text style={[styles.title, variant === 'location' ? styles.locationTitle : styles.verifiedTitle]}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={onPrimaryPress}>
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </TouchableOpacity>

          {secondaryLabel && onSecondaryPress ? (
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9} onPress={onSecondaryPress}>
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
    paddingTop: 245,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  contentWrap: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D5EBF6',
  },
  locationCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  verifiedCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  title: {
    color: '#182035',
    textAlign: 'center',
    fontWeight: '600',
  },
  locationTitle: {
    fontSize: 20,
    lineHeight: 30,
  },
  verifiedTitle: {
    fontSize: 24,
    lineHeight: 34,
  },
  message: {
    color: '#344054',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
  },
  primaryButton: {
    height: 45,
    borderRadius: 10,
    backgroundColor: '#4AAFD9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
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
