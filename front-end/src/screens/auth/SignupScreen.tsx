import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { BackIcon } from '../../components/icons/BackIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { CaretDownIcon } from '../../components/icons/CaretDownIcon';
import { CheckIcon } from '../../components/icons/CheckIcon';
import { RootScreenProps } from '../../types/navigation';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9\s()+-]+$/;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FORM_WIDTH = Math.min(323, SCREEN_WIDTH - 66);

/* ---------- COUNTRY LIST ---------- */
const COUNTRY_CODES = [
  { code: '+855', country: 'Cambodia' },
  { code: '+216', country: 'Tunisia' },
  { code: '+212', country: 'Morocco' },
  { code: '+213', country: 'Algeria' },
  { code: '+33', country: 'France' },
  { code: '+1', country: 'USA' },
];

/* ---------- SCREEN ---------- */
export default function SignupScreen({ navigation }: RootScreenProps<'Signup'>) {
  const { register, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+855');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !phone || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const phoneValue = phone.trim();
    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (!PHONE_REGEX.test(phoneValue) || phoneDigits.length < 6 || phoneDigits.length > 15) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    try {
      setLoading(true);

      await register(email.trim().toLowerCase(), password, firstName, lastName);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });

    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <BackIcon color="#292526" width={24} height={24} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.form, { width: FORM_WIDTH }]}>
          <View style={styles.headerBlock}>
            <Text style={styles.headerTitle}>Create account</Text>
            <Text style={styles.headerSubtitle}>Get the best out of derleng by creating an account</Text>
          </View>

          <View style={styles.fieldsContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="#000000"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#000000"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.phoneRow}>
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={styles.countryPickerButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <CaretDownIcon width={19} height={18} color="#000000" />
                </TouchableOpacity>

                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="123 456 789"
                  placeholderTextColor="#000000"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="jonhn.ux@gmail.com"
                placeholderTextColor="#000000"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#000000"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeButton}>
                  <EyeIcon color="#292526" width={19} height={19} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptTerms((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <CheckIcon width={11} height={8} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>I accept term and condition</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            disabled={!acceptTerms || loading}
            style={[styles.submitButton, (!acceptTerms || loading) && styles.submitButtonDisabled]}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerRow} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.footerLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* COUNTRY MODAL */}
      <Modal visible={showCountryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCountryCode(item.code);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text>{item.country} ({item.code})</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 28,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    right: 25,
    top: 52,
    width: 40,
    height: 40,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDFDFD',
    zIndex: 10,
    shadowColor: 'rgba(41,37,38,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  form: {
    marginTop: 100,
  },
  headerBlock: {
    gap: 5,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
    color: '#000000',
  },
  headerSubtitle: {
    color: 'rgba(0,0,0,0.8)',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldGroup: {
    gap: 2,
  },
  label: {
    color: 'rgba(0,0,0,0.8)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#000000',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 5,
  },
  countryPickerButton: {
    width: 85,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryCodeText: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  phoneInput: {
    flex: 1,
  },
  passwordInputWrap: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 10,
  },
  eyeButton: {
    paddingVertical: 4,
    paddingLeft: 10,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4AAFD9',
    borderColor: '#4AAFD9',
  },
  termsText: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 34,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#4AAFD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  footerRow: {
    marginTop: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 10,
    lineHeight: 14,
  },
  footerLink: {
    color: '#000000',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
});