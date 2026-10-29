import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import BrandLogo from '../../components/BrandLogo';
import { colors } from '../../theme/colors';

export default function DeliveryAuthScreen({ navigation }) {
  const { switchRole, loginPartner, registerPartner } = usePartnerAuth();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Delivery Partner Registration State
  const [riderForm, setRiderForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: 'EV Scooter',
    vehicleNumber: '',
    drivingLicense: '',
    zone: 'Banjara Hills & Jubilee Hills',
  });

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

  const handleRiderSubmit = async () => {
    if (!riderForm.name || !riderForm.phone || !riderForm.vehicleNumber) {
      Alert.alert('Required Fields', 'Please complete your name, phone, and vehicle registration number.');
      return;
    }
    setLoading(true);
    try {
      await switchRole('delivery');
      await registerPartner(
        {
          name: riderForm.name,
          email: riderForm.email,
          phone: riderForm.phone,
          vehicleType: riderForm.vehicleType,
          vehicleNumber: riderForm.vehicleNumber,
        },
        'delivery'
      );
      Alert.alert('Fleet KYC Approved! 🛵', 'Your rider captain account is active. Welcome to Paw Fleet!');
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Registration Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {/* Brand Logo Header */}
      <View style={styles.brandHeader}>
        <BrandLogo size="small" subtitle="Fleet Operations" dark={false} />
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>
          {mode === 'signin' ? 'Delivery Captain Sign In' : 'Rider Fleet Registration'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {mode === 'signin'
            ? 'Sign in to access your duty toggle, live trips pool & wallet'
            : 'Join our verified electric & express pet delivery fleet'}
        </Text>

        {/* Sub-mode Switcher */}
        <View style={styles.subModeRow}>
          <TouchableOpacity
            style={[styles.subModeTab, mode === 'signin' && styles.subModeTabActive]}
            onPress={() => setMode('signin')}
          >
            <Text style={[styles.subModeText, mode === 'signin' && styles.subModeTextActive]}>
              Captain Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subModeTab, mode === 'signup' && styles.subModeTabActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.subModeText, mode === 'signup' && styles.subModeTextActive]}>
              Rider Registration
            </Text>
          </TouchableOpacity>
        </View>

        {/* -------------------- 1. RIDER SIGN IN -------------------- */}
        {mode === 'signin' && (
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

            <TouchableOpacity
              style={styles.submitBtnDelivery}
              onPress={handleRiderLogin}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Accessing Hub...' : 'Sign In as Delivery Captain'}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.switchModeFooter}
              onPress={() => setMode('signup')}
            >
              <Text style={styles.switchModeMuted}>New Delivery Partner? </Text>
              <Text style={styles.switchModeAction}>Join Delivery Fleet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* -------------------- 2. RIDER REGISTRATION -------------------- */}
        {mode === 'signup' && (
          <View style={styles.formSection}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>RIDER PROFILE & VEHICLE KYC</Text>
            </View>

            <Text style={styles.label}>Captain Full Legal Name *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. Raju Kumar"
              placeholderTextColor="#94A3B8"
              value={riderForm.name}
              onChangeText={(val) => setRiderForm({ ...riderForm, name: val })}
            />

            <Text style={styles.label}>Mobile Phone Number *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. +91 98451 22334"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={riderForm.phone}
              onChangeText={(val) => setRiderForm({ ...riderForm, phone: val })}
            />

            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. rider@pawstreet.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={riderForm.email}
              onChangeText={(val) => setRiderForm({ ...riderForm, email: val })}
            />

            <Text style={styles.label}>Account Password *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={riderForm.password}
              onChangeText={(val) => setRiderForm({ ...riderForm, password: val })}
            />

            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.typeSelectorRow}>
              {['EV Scooter', 'Motorcycle', 'Bicycle'].map((vType) => (
                <TouchableOpacity
                  key={vType}
                  style={[styles.typeChip, riderForm.vehicleType === vType && styles.typeChipActive]}
                  onPress={() => setRiderForm({ ...riderForm, vehicleType: vType })}
                >
                  <Text style={[styles.typeChipText, riderForm.vehicleType === vType && styles.typeChipTextActive]}>
                    {vType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Vehicle Registration Number *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. TS 09 EQ 4421"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={riderForm.vehicleNumber}
              onChangeText={(val) => setRiderForm({ ...riderForm, vehicleNumber: val })}
            />

            <Text style={styles.label}>Driving License KYC Number</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. DL-0420190021345"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={riderForm.drivingLicense}
              onChangeText={(val) => setRiderForm({ ...riderForm, drivingLicense: val })}
            />

            <Text style={styles.label}>Operating Delivery Zone</Text>
            <TextInput
              style={styles.inputSimple}
              value={riderForm.zone}
              onChangeText={(val) => setRiderForm({ ...riderForm, zone: val })}
            />

            <TouchableOpacity
              style={styles.submitBtnDelivery}
              onPress={handleRiderSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Registering...' : 'Register as Delivery Captain'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeFooter}
              onPress={() => setMode('signin')}
            >
              <Text style={styles.switchModeMuted}>Already registered? </Text>
              <Text style={[styles.switchModeAction, { color: '#059669' }]}>Captain Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
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
});

