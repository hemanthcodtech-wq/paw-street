import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';

export default function AuthScreen({ navigation }) {
  const { login, register, loginWithTokenAndUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [loading, setLoading] = useState(false);

  // Deep Link listener for Google Auth Bridge (pawstreetuser://auth)
  useEffect(() => {
    const handleUrl = (event) => {
      const url = event?.url || event;
      if (!url) return;

      try {
        const parsed = new URL(url);
        const status = parsed.searchParams.get('status');
        const token = parsed.searchParams.get('token');
        const userJson = parsed.searchParams.get('user');
        const googleEmail = parsed.searchParams.get('email');
        const googleName = parsed.searchParams.get('name');
        const message = parsed.searchParams.get('message');

        if (status === 'success' && token && userJson) {
          const userData = JSON.parse(decodeURIComponent(userJson));
          loginWithTokenAndUser(token, userData);
          navigation.replace('MainTabs');
        } else if (status === 'not_registered') {
          // STRICT CHECK: User not registered -> prompt to sign up with email prefilled
          Alert.alert(
            'Account Not Found',
            `No registered account found for ${googleEmail || 'this Google email'}. Please complete sign up to create your account.`
          );
          setIsSignUp(true);
          if (googleEmail) setEmail(googleEmail);
          if (googleName) setName(googleName);
        } else if (status === 'error') {
          Alert.alert('Sign In Error', message || 'Google authentication was cancelled.');
        }
      } catch (err) {
        console.warn('Deep link parse error:', err);
      }
    };

    const sub = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then((initUrl) => {
      if (initUrl) handleUrl(initUrl);
    });

    return () => {
      if (sub && typeof sub.remove === 'function') sub.remove();
    };
  }, [navigation, loginWithTokenAndUser]);

  const handleCustomerLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const authUrl = 'https://pawnear.in/api/auth/google/start?app=user&role=customer';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = authUrl;
      } else {
        await Linking.openURL(authUrl);
      }
    } catch (e) {
      Alert.alert('Google Sign-In Error', e.message || 'Unable to open Google sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter name, email and password');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, phone, petName: petName || 'My Pet', breed: petBreed || 'Companion' });
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Sign Up Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen backgroundColor="#FAF7F2">
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <BrandLogo size="small" subtitle="PAW NEAR" dark={false} />
      </View>

      {/* Main Auth Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>
          {isSignUp ? 'Create Customer Account' : 'Customer Sign In'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {isSignUp
            ? 'Join Paw Street for instant pet food & supplies delivery'
            : 'Welcome back! Sign in to order pet essentials in 15 minutes'}
        </Text>

        {isSignUp ? (
          /* Sign Up Form */
          <>
            <Text style={styles.label}>Your Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Priya Sharma"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. priya@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 9876543210"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.petRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Pet Name (Optional)</Text>
                <TextInput
                  style={styles.textInputSimple}
                  placeholder="e.g. Bruno"
                  placeholderTextColor={colors.textMuted}
                  value={petName}
                  onChangeText={setPetName}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Pet Breed</Text>
                <TextInput
                  style={styles.textInputSimple}
                  placeholder="e.g. Retriever / Persian"
                  placeholderTextColor={colors.textMuted}
                  value={petBreed}
                  onChangeText={setPetBreed}
                />
              </View>
            </View>

            <Text style={styles.label}>Create Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleCustomerSignUp}
              disabled={loading}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? 'Creating Account...' : 'Sign Up as Pet Parent'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Login Form */
          <>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. customer@thepawstreet.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Customer Login Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleCustomerLogin}
              disabled={loading}
            >
              <Ionicons name="paw" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryBtnText}>
                {loading ? 'Signing in...' : 'Customer Login'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <View style={styles.googleIconCircle}>
                <Ionicons name="logo-google" size={18} color="#EA4335" />
              </View>
              <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Switch Login / Sign Up */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.toggleTextMuted}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <Text style={styles.toggleTextAction}>
            {isSignUp ? ' Customer Login' : ' Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Continue as Guest */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.guestText}>Continue as Guest →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#FAF7F2',
    padding: 20,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: '#0F172A',
  },
  petRow: {
    flexDirection: 'row',
  },
  textInputSimple: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryBtn: {
    backgroundColor: '#FB8500',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#FB8500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleTextMuted: {
    fontSize: 13,
    color: '#64748B',
  },
  toggleTextAction: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FB8500',
  },
  guestBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  guestText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
