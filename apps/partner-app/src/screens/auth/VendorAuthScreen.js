import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import BrandLogo from '../../components/BrandLogo';
import { colors } from '../../theme/colors';

export default function VendorAuthScreen({ navigation }) {
  const { switchRole, loginPartner, registerPartner } = usePartnerAuth();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Vendor Onboarding Form State (from website VendorOnboardingPage.jsx)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    businessType: 'Pet Food & Retail Store',
    tradeLicenceNumber: '',
    gstin: '',
    panNumber: '',
    aadhaarNumber: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    address: '',
    city: 'Hyderabad',
    pincode: '500034',
  });

  const businessTypes = [
    'Pet Food & Retail Store',
    'Veterinary Clinic & Hospital',
    'Pet Grooming Spa',
    'Pet Boarding & Daycare',
    'Dog Walking & Training'
  ];

  const handleVendorLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Required Fields', 'Please enter your registered vendor email and password.');
      return;
    }
    setLoading(true);
    try {
      await switchRole('vendor');
      await loginPartner(trimmedEmail, trimmedPassword, 'vendor');
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Login Error', e.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.storeName) {
      Alert.alert('Required Fields', 'Please fill in Owner Name, Email, and Store Display Name.');
      return;
    }
    setLoading(true);
    try {
      await switchRole('vendor');
      await registerPartner(
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          storeName: formData.storeName,
          city: formData.city,
        },
        'vendor'
      );
      Alert.alert('Application Submitted! 🎉', `KYC recorded for ${formData.storeName}. Welcome to the Vendor Network!`);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Submission Error', e.message);
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
        <View style={styles.roleBadgeVendor}>
          <Ionicons name="storefront" size={14} color="#FB8500" />
          <Text style={styles.roleBadgeText}>STORE VENDOR</Text>
        </View>
      </View>

      {/* Brand Logo Header */}
      <View style={styles.brandHeader}>
        <BrandLogo size="small" subtitle="Vendor Operations" dark={false} />
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>
          {mode === 'signin' ? 'Store Vendor Sign In' : 'Vendor Onboarding Form'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {mode === 'signin'
            ? 'Access your pet store catalog, stock manager & orders hub'
            : 'Register your pet shop, clinic, spa or boarding with verified KYC'}
        </Text>

        {/* Sub-mode Switcher */}
        <View style={styles.subModeRow}>
          <TouchableOpacity
            style={[styles.subModeTab, mode === 'signin' && styles.subModeTabActive]}
            onPress={() => setMode('signin')}
          >
            <Text style={[styles.subModeText, mode === 'signin' && styles.subModeTextActive]}>
              Vendor Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subModeTab, mode === 'signup' && styles.subModeTabActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.subModeText, mode === 'signup' && styles.subModeTextActive]}>
              Register Store (Onboarding)
            </Text>
          </TouchableOpacity>
        </View>

        {/* -------------------- 1. VENDOR SIGN IN -------------------- */}
        {mode === 'signin' && (
          <View style={styles.formSection}>
            <Text style={styles.label}>Registered Vendor Email</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="vendor@pawstreet.com"
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
              style={styles.submitBtnVendor}
              onPress={handleVendorLogin}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Signing in...' : 'Sign In to Vendor Hub'}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.switchModeFooter}
              onPress={() => setMode('signup')}
            >
              <Text style={styles.switchModeMuted}>New Pet Store Owner? </Text>
              <Text style={styles.switchModeAction}>Apply for Onboarding</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* -------------------- 2. VENDOR ONBOARDING (5 SECTIONS) -------------------- */}
        {mode === 'signup' && (
          <View style={styles.formSection}>
            {/* Section 1 */}
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 1: OWNER & ACCOUNT</Text>
            </View>

            <Text style={styles.label}>Owner Full Legal Name *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. Rajesh Kumar Sharma"
              placeholderTextColor="#94A3B8"
              value={formData.fullName}
              onChangeText={(val) => setFormData({ ...formData, fullName: val })}
            />

            <Text style={styles.label}>Owner Email Address *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. rajesh@pawstreet.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(val) => setFormData({ ...formData, email: val })}
            />

            <Text style={styles.label}>Mobile Phone Number *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. +91 98765 43210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(val) => setFormData({ ...formData, phone: val })}
            />

            <Text style={styles.label}>Account Password *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={formData.password}
              onChangeText={(val) => setFormData({ ...formData, password: val })}
            />

            {/* Section 2 */}
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 2: STORE DETAILS & BUSINESS TYPE</Text>
            </View>

            <Text style={styles.label}>Store Display Name *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. Paw Street Central Superstore"
              placeholderTextColor="#94A3B8"
              value={formData.storeName}
              onChangeText={(val) => setFormData({ ...formData, storeName: val })}
            />

            <Text style={styles.label}>Primary Business Model</Text>
            <View style={styles.typeSelectorRow}>
              {businessTypes.map((bType) => (
                <TouchableOpacity
                  key={bType}
                  style={[styles.typeChip, formData.businessType === bType && styles.typeChipActive]}
                  onPress={() => setFormData({ ...formData, businessType: bType })}
                >
                  <Text style={[styles.typeChipText, formData.businessType === bType && styles.typeChipTextActive]}>
                    {bType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Section 3 */}
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 3: KYC, GST & LICENCE (SECTION 4.1)</Text>
            </View>

            <Text style={styles.label}>Trade Licence / Municipal Registration No.</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. TL-HYD-2024-8921"
              placeholderTextColor="#94A3B8"
              value={formData.tradeLicenceNumber}
              onChangeText={(val) => setFormData({ ...formData, tradeLicenceNumber: val })}
            />

            <Text style={styles.label}>GSTIN (Goods & Services Tax ID)</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. 36AAECP1245K1Z9"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={formData.gstin}
              onChangeText={(val) => setFormData({ ...formData, gstin: val })}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Business PAN</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="ABCDE1234F"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  value={formData.panNumber}
                  onChangeText={(val) => setFormData({ ...formData, panNumber: val })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Aadhaar No</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="XXXX XXXX XXXX"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={formData.aadhaarNumber}
                  onChangeText={(val) => setFormData({ ...formData, aadhaarNumber: val })}
                />
              </View>
            </View>

            {/* Section 4 */}
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 4: BANKING & SETTLEMENTS</Text>
            </View>

            <Text style={styles.label}>Bank Name & Account Holder</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="HDFC Bank - Rajesh Sharma"
              placeholderTextColor="#94A3B8"
              value={formData.bankName}
              onChangeText={(val) => setFormData({ ...formData, bankName: val })}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Account Number</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="50200034821901"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={formData.accountNumber}
                  onChangeText={(val) => setFormData({ ...formData, accountNumber: val })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>IFSC Code</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="HDFC0001244"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  value={formData.ifscCode}
                  onChangeText={(val) => setFormData({ ...formData, ifscCode: val })}
                />
              </View>
            </View>

            <Text style={styles.label}>UPI ID (Instant Payouts)</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="storename@okhdfcbank"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={formData.upiId}
              onChangeText={(val) => setFormData({ ...formData, upiId: val })}
            />

            {/* Section 5 */}
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 5: STORE LOCATION ADDRESS</Text>
            </View>

            <Text style={styles.label}>Store Address</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="Road No 12, Banjara Hills"
              placeholderTextColor="#94A3B8"
              value={formData.address}
              onChangeText={(val) => setFormData({ ...formData, address: val })}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.inputSimple}
                  value={formData.city}
                  onChangeText={(val) => setFormData({ ...formData, city: val })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.inputSimple}
                  value={formData.pincode}
                  onChangeText={(val) => setFormData({ ...formData, pincode: val })}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitBtnVendor}
              onPress={handleOnboardingSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Submitting Application...' : 'Submit Vendor Onboarding Application'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeFooter}
              onPress={() => setMode('signin')}
            >
              <Text style={styles.switchModeMuted}>Already registered as a vendor? </Text>
              <Text style={styles.switchModeAction}>Vendor Sign In</Text>
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
  roleBadgeVendor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FB8500',
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
    shadowColor: '#FB8500',
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
  submitBtnVendor: {
    backgroundColor: '#FB8500',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#FB8500',
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
    color: '#FB8500',
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
    color: '#FB8500',
  },
  sectionBadge: {
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  twoCol: {
    flexDirection: 'row',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  typeChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChipActive: {
    backgroundColor: '#FB8500',
    borderColor: '#FB8500',
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

