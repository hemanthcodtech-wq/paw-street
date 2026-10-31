import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import { colors } from '../../theme/colors';
import SafeScreen from '../../components/SafeScreen';

export default function DeliveryAuthScreen({ navigation }) {
  const { switchRole, loginPartner, loginPartnerWithTokenAndUser } = usePartnerAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Deep Link listener for Google Auth Bridge
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
          loginPartnerWithTokenAndUser(token, userData, 'delivery');
          navigation.replace('MainTabs');
        } else if (status === 'not_registered') {
          Alert.alert(
            'Rider Account Not Found',
            `No registered delivery account found for ${googleEmail || 'this email'}. Please complete registration below to join the fleet.`
          );
          setMode('signup');
          setRiderForm((prev) => ({
            ...prev,
            email: googleEmail || prev.email,
            name: googleName || prev.name,
          }));
        } else if (status === 'error') {
          Alert.alert('Sign In Error', message || 'Google sign-in was cancelled.');
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
  }, [navigation, loginPartnerWithTokenAndUser]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const authUrl = 'https://pawnear.in/api/auth/google/start?app=partner&role=delivery';
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

  const handleRiderLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Required Fields', 'Please enter your registered rider email and password.');
      return;
    }
    setLoading(true);
    try {
      await switchRole('delivery');
      await loginPartner(trimmedEmail, trimmedPassword, 'delivery');
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Login Error', e.message || 'Unable to sign in as rider.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen backgroundColor="#FAF7F2">
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      {/* Top Header with Back Navigation */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('PartnerWelcome')}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
          <Text style={styles.backBtnText}>Choose Role</Text>
        </TouchableOpacity>
        <View style={styles.roleBadgeDelivery}>
          <Ionicons name="bicycle" size={14} color="#059669" />
          <Text style={styles.roleBadgeText}>DELIVERY FLEET</Text>
        </View>
      </View>

      {/* Main Sign In Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Delivery Captain Sign In</Text>
        <Text style={styles.cardSubtitle}>
          Sign in to access your duty toggle, live trips pool & wallet
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Registered Rider Email</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="delivery@pawstreet.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginTop: 8, marginBottom: 16 }}
            onPress={() => {
              Alert.alert(
                'Forgot Password',
                'Your delivery captain credentials are created and managed by your store vendor. Please contact your vendor administrator to reset your password.'
              );
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#059669' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtnDelivery}
            onPress={handleRiderLogin}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? 'Accessing Hub...' : 'Sign In as Delivery Captain'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#FAF7F2',
    padding: 18,
    justifyContent: 'center',
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleBadgeDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
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
    marginBottom: 16,
    lineHeight: 16,
  },
  subModeRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  subModeTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  subModeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  subModeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  subModeTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  formSection: {
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
    marginTop: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 13,
    color: '#0F172A',
  },
  inputSimple: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitBtnDelivery: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  demoFillBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },
  demoFillText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  switchModeFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  switchModeMuted: {
    fontSize: 12,
    color: '#64748B',
  },
  switchModeAction: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 4,
  },
  typeChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orDividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
});

