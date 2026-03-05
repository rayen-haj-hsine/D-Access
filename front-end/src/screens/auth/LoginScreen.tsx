import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { RootScreenProps } from '../../types/navigation';
import { GoogleIcon } from '../../components/icons/Google';
import { EyeIcon } from '../../components/icons/EyeIcon';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FORM_WIDTH = Math.min(323, SCREEN_WIDTH - 66);

export default function LoginScreen({ navigation }: RootScreenProps<'Login'>) {
    const { login, loginWithGoogle, loginWithFacebook, loginWithApple } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!EMAIL_REGEX.test(email.trim())) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            await login(email.trim().toLowerCase(), password);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Login failed';
            Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (
        provider: 'google' | 'facebook' | 'apple',
        action: () => Promise<void>,
    ) => {
        try {
            setSocialLoading(provider);
            await action();
        } catch (error: any) {
            Alert.alert('Error', `${provider} login failed. Please try again.`);
        } finally {
            setSocialLoading(null);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Discover</Text>
                <Text style={styles.subtitle}>Please choose your login option below</Text>
            </View>

            <View style={[styles.formContainer, { width: FORM_WIDTH }]}>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your  email address"
                        placeholderTextColor="rgba(0,0,0,0.6)"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={[styles.fieldGroup, styles.passwordGroup]}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordInputWrap}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor="rgba(0,0,0,0.6)"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword((prev) => !prev)}
                            activeOpacity={0.8}
                        >
                            <EyeIcon width={19} height={19} color={colors.gray900} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading || !!socialLoading}
                    style={[styles.loginButton, (loading || !!socialLoading) && styles.disabled]}
                    activeOpacity={0.88}
                >
                    {loading ? (
                        <ActivityIndicator color="#F4F3F5" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or login with</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin('facebook', loginWithFacebook)}
                        disabled={loading || !!socialLoading}
                    >
                        {socialLoading === 'facebook' ? (
                            <ActivityIndicator size="small" color={colors.gray900} />
                        ) : (
                            <>
                                <View style={styles.facebookBadge}>
                                    <Text style={styles.facebookBadgeText}>f</Text>
                                </View>
                                <Text style={styles.socialText}>Facebook</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin('google', loginWithGoogle)}
                        disabled={loading || !!socialLoading}
                    >
                        {socialLoading === 'google' ? (
                            <ActivityIndicator size="small" color={colors.gray900} />
                        ) : (
                            <>
                                <GoogleIcon width={18} height={18} />
                                <Text style={styles.socialText}>Gmail</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin('apple', loginWithApple)}
                        disabled={loading || !!socialLoading}
                    >
                        {socialLoading === 'apple' ? (
                            <ActivityIndicator size="small" color={colors.gray900} />
                        ) : (
                            <>
                                <Text style={styles.appleMark}></Text>
                                <Text style={styles.socialText}>Apple</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.createAccountContainer}>
                    <Text style={styles.createAccountText}>Doesn&apos;t have account on dicover? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.createAccountLink}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 154,
        marginBottom: 46,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0D0D0D',
        marginBottom: 4,
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: 'rgba(0,0,0,0.8)',
        fontWeight: '400',
    },
    formContainer: {
        gap: 20,
    },
    fieldGroup: {
        gap: 2,
    },
    passwordGroup: {
        marginTop: 2,
    },
    label: {
        color: 'rgba(0,0,0,0.6)',
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
        paddingVertical: 10,
        backgroundColor: colors.white,
        fontSize: 14,
        color: '#000000',
    },
    passwordInputWrap: {
        height: 52,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        fontSize: 14,
        color: '#000000',
        paddingVertical: 10,
    },
    eyeButton: {
        paddingLeft: 10,
        paddingVertical: 6,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -8,
    },
    forgotPasswordText: {
        color: '#0061D2',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    loginButton: {
        height: 52,
        borderRadius: 10,
        backgroundColor: '#4AAFD9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.65,
    },
    loginButtonText: {
        color: '#F4F3F5',
        fontSize: 16,
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    dividerText: {
        width: 103,
        textAlign: 'center',
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 8,
        height: 52,
    },
    socialButton: {
        flex: 1,
        height: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        gap: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    facebookBadge: {
        width: 21,
        height: 21,
        borderRadius: 11,
        backgroundColor: '#1877F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    facebookBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '700',
    },
    appleMark: {
        color: '#000000',
        fontSize: 16,
        lineHeight: 16,
        fontWeight: '700',
    },
    socialText: {
        color: '#000000',
        fontSize: 12,
        lineHeight: 16,
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 38,
        paddingHorizontal: 10,
    },
    createAccountText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 10,
        lineHeight: 14,
    },
    createAccountLink: {
        color: '#000000',
        fontWeight: '600',
        fontSize: 10,
        lineHeight: 14,
    },
});
