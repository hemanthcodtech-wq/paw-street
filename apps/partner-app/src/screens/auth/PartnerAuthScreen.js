import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import BrandLogo from '../../components/BrandLogo';
import { colors } from '../../theme/colors';

export default function PartnerAuthScreen({ navigation }) {
  const { switchRole, loginPartner, registerPartner } = usePartnerAuth();

  // Active Role: 'vendor' | 'delivery'
  const [selectedRole, setSelectedRole] = useState('vendor');
  // Sub-mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Vendor Onboarding Form State (matching website VendorOnboardingPage.jsx)
  const [vendorForm, setVendorForm] = useState({
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

  // Delivery Partner Form State
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

  // Common Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    switchRole(role);
    setAuthMode('signin');
  };

  const handlePartnerLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Required', 'Please enter your partner email and password');
      return;
    }
    setLoading(true);
    try {
      await loginPartner(loginEmail, loginPassword, selectedRole);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorOnboardingSubmit = async () => {
    if (!vendorForm.fullName || !vendorForm.email || !vendorForm.storeName) {
      Alert.alert('Required Fields', 'Please complete the Owner Name, Email, and Store Name.');
      return;
    }
    setLoading(true);
    try {
      await registerPartner(
        {
          name: vendorForm.fullName,
          email: vendorForm.email,
          phone: vendorForm.phone,
          storeName: vendorForm.storeName,
          city: vendorForm.city,
        },
        'vendor'
      );
      Alert.alert(
        'Application Submitted! 🎉',
        `${vendorForm.storeName} KYC documents recorded. Welcome to the Paw Street Partner Network!`
      );
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Submission Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRiderRegistrationSubmit = async () => {
    if (!riderForm.name || !riderForm.phone || !riderForm.vehicleNumber) {
      Alert.alert('Required Fields', 'Please fill name, phone, and vehicle registration number.');
      return;
    }
    setLoading(true);
    try {
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
      Alert.alert('Fleet KYC Approved! 🛵', 'Your rider captain account is now active.');
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Registration Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    'Pet Food & Retail Store',
    'Veterinary Clinic & Hospital',
    'Pet Grooming Spa',
    'Pet Boarding & Daycare',
    'Dog Walking & Training'
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <BrandLogo size="small" subtitle="Partner Portal" dark={false} />
      </View>

      {/* Primary Role Choice Buttons */}
      <View style={styles.roleButtonsWrapper}>
        <TouchableOpacity
          style={[styles.roleSelectBtn, selectedRole === 'vendor' && styles.roleBtnActiveVendor]}
          onPress={() => handleRoleSelect('vendor')}
        >
          <Ionicons
            name="storefront"
            size={18}
            color={selectedRole === 'vendor' ? '#FFFFFF' : '#64748B'}
          />
          <Text style={[styles.roleSelectText, selectedRole === 'vendor' && styles.roleSelectTextActive]}>
            Login as Vendor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleSelectBtn, selectedRole === 'delivery' && styles.roleBtnActiveDelivery]}
          onPress={() => handleRoleSelect('delivery')}
        >
          <Ionicons
            name="bicycle"
            size={18}
            color={selectedRole === 'delivery' ? '#FFFFFF' : '#64748B'}
          />
          <Text style={[styles.roleSelectText, selectedRole === 'delivery' && styles.roleSelectTextActive]}>
            Login as Delivery Partner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Form Card on Clean White */}
      <View style={styles.card}>
        {/* Header Indicator */}
        <View style={styles.formHeaderRow}>
          <Text style={styles.portalTitle}>
            {selectedRole === 'vendor' ? '🏪 Store Vendor Portal' : '🛵 Delivery Partner Portal'}
          </Text>
          <Text style={styles.portalSubtitle}>
            {selectedRole === 'vendor'
              ? 'Manage orders, live inventory & daily store payouts'
              : 'Instant order pickup dispatch, GPS tracking & rider wallet'}
          </Text>
        </View>

        {/* Sub-mode Tab (Sign In vs Register/Onboard) */}
        <View style={styles.subModeRow}>
          <TouchableOpacity
            style={[styles.subModeTab, authMode === 'signin' && styles.subModeTabActive]}
            onPress={() => setAuthMode('signin')}
          >
            <Text style={[styles.subModeText, authMode === 'signin' && styles.subModeTextActive]}>
              Partner Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subModeTab, authMode === 'signup' && styles.subModeTabActive]}
            onPress={() => setAuthMode('signup')}
          >
            <Text style={[styles.subModeText, authMode === 'signup' && styles.subModeTextActive]}>
              {selectedRole === 'vendor' ? 'Register Store (Onboarding)' : 'Rider Onboarding'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* -------------------- 1. PARTNER SIGN IN VIEW -------------------- */}
        {authMode === 'signin' && (
          <View style={styles.formSection}>
            <Text style={styles.label}>Registered Partner Email</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder={selectedRole === 'vendor' ? 'vendor@pawstreet.com' : 'delivery@pawstreet.com'}
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={loginEmail}
                onChangeText={setLoginEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={loginPassword}
                onChangeText={setLoginPassword}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                selectedRole === 'delivery' ? styles.submitBtnDelivery : styles.submitBtnVendor
              ]}
              onPress={handlePartnerLogin}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading
                  ? 'Accessing Portal...'
                  : selectedRole === 'vendor'
                  ? 'Sign In to Vendor Hub'
                  : 'Sign In to Fleet Captain Hub'}
              </Text>
            </TouchableOpacity>

            {/* Quick Demo Credentials Link */}
            <TouchableOpacity
              style={styles.demoFillBtn}
              onPress={() => {
                setLoginEmail(selectedRole === 'vendor' ? 'vendor@pawstreet.com' : 'delivery@pawstreet.com');
                setLoginPassword('password123');
              }}
            >
              <Text style={styles.demoFillText}>⚡ Autofill Demo {selectedRole === 'vendor' ? 'Vendor' : 'Rider'} Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* -------------------- 2. VENDOR ONBOARDING FORM (FROM WEBSITE) -------------------- */}
        {authMode === 'signup' && selectedRole === 'vendor' && (
          <View style={styles.formSection}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 1: OWNER & ACCOUNT</Text>
            </View>

            <Text style={styles.label}>Full Legal Name *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. Rajesh Kumar Sharma"
              placeholderTextColor="#94A3B8"
              value={vendorForm.fullName}
              onChangeText={(val) => setVendorForm({ ...vendorForm, fullName: val })}
            />

            <Text style={styles.label}>Owner Email Address *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. rajesh@pawstreet.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={vendorForm.email}
              onChangeText={(val) => setVendorForm({ ...vendorForm, email: val })}
            />

            <Text style={styles.label}>Mobile Phone Number *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. +91 98765 43210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={vendorForm.phone}
              onChangeText={(val) => setVendorForm({ ...vendorForm, phone: val })}
            />

            <Text style={styles.label}>Account Password *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={vendorForm.password}
              onChangeText={(val) => setVendorForm({ ...vendorForm, password: val })}
            />

            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 2: STORE DETAILS & BUSINESS TYPE</Text>
            </View>

            <Text style={styles.label}>Pet Store / Clinic Display Name *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. Paw Street Central Superstore"
              placeholderTextColor="#94A3B8"
              value={vendorForm.storeName}
              onChangeText={(val) => setVendorForm({ ...vendorForm, storeName: val })}
            />

            <Text style={styles.label}>Primary Business Model</Text>
            <View style={styles.typeSelectorRow}>
              {businessTypes.map((bType) => (
                <TouchableOpacity
                  key={bType}
                  style={[styles.typeChip, vendorForm.businessType === bType && styles.typeChipActive]}
                  onPress={() => setVendorForm({ ...vendorForm, businessType: bType })}
                >
                  <Text style={[styles.typeChipText, vendorForm.businessType === bType && styles.typeChipTextActive]}>
                    {bType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 3: KYC, GST & LICENCE (SECTION 4.1)</Text>
            </View>

            <Text style={styles.label}>Store Trade Licence / Registration No.</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. TL-HYD-2024-8921"
              placeholderTextColor="#94A3B8"
              value={vendorForm.tradeLicenceNumber}
              onChangeText={(val) => setVendorForm({ ...vendorForm, tradeLicenceNumber: val })}
            />

            <Text style={styles.label}>GSTIN (Goods & Services Tax ID)</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. 36AAECP1245K1Z9"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={vendorForm.gstin}
              onChangeText={(val) => setVendorForm({ ...vendorForm, gstin: val })}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Business PAN</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="ABCDE1234F"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  value={vendorForm.panNumber}
                  onChangeText={(val) => setVendorForm({ ...vendorForm, panNumber: val })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Aadhaar No</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="XXXX XXXX XXXX"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={vendorForm.aadhaarNumber}
                  onChangeText={(val) => setVendorForm({ ...vendorForm, aadhaarNumber: val })}
                />
              </View>
            </View>

            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 4: BANKING & SETTLEMENTS</Text>
            </View>

            <Text style={styles.label}>Bank Name & Account Holder</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="HDFC Bank - Rajesh Sharma"
              placeholderTextColor="#94A3B8"
              value={vendorForm.bankName}
              onChangeText={(val) => setVendorForm({ ...vendorForm, bankName: val })}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Account Number</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="50200034821901"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={vendorForm.accountNumber}
                  onChangeText={(val) => setVendorForm({ ...vendorForm, accountNumber: val })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>IFSC Code</Text>
                <TextInput
                  style={styles.inputSimple}
                  placeholder="HDFC0001244"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  value={vendorForm.ifscCode}
                  onChangeText={(val) => setVendorForm({ ...vendorForm, ifscCode: val })}
                />
              </View>
            </View>

            <Text style={styles.label}>UPI ID (Instant Payouts)</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. storename@okhdfcbank"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={vendorForm.upiId}
              onChangeText={(val) => setVendorForm({ ...vendorForm, upiId: val })}
            />

            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>SECTION 5: STORE LOCATION ADDRESS</Text>
            </View>

            <Text style={styles.label}>Store Address</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="Road No 12, Banjara Hills"
              placeholderTextColor="#94A3B8"
              value={vendorForm.address}
              onChangeText={(val) => setVendorForm({ ...vendorForm, address: val })}
            />

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.inputSimple}
                  value={vendorForm.city}
                  onChangeText={(val) => setVendorForm({ ...vendorForm, city: val })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.inputSimple}
                  value={vendorForm.pincode}
                  onChangeText={(val) => setVendorForm({ ...vendorForm, pincode: val })}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, styles.submitBtnVendor]}
              onPress={handleVendorOnboardingSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Submitting Application...' : 'Submit Vendor Onboarding Application'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* -------------------- 3. DELIVERY RIDER ONBOARDING FORM -------------------- */}
        {authMode === 'signup' && selectedRole === 'delivery' && (
          <View style={styles.formSection}>
            <View style={[styles.sectionBadge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.sectionBadgeText, { color: '#15803D' }]}>RIDER PROFILE & VEHICLE KYC</Text>
            </View>

            <Text style={styles.label}>Captain Full Name *</Text>
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

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. rider@pawstreet.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={riderForm.email}
              onChangeText={(val) => setRiderForm({ ...riderForm, email: val })}
            />

            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.typeSelectorRow}>
              {['EV Scooter', 'Motorcycle', 'Bicycle'].map((vType) => (
                <TouchableOpacity
                  key={vType}
                  style={[styles.typeChip, riderForm.vehicleType === vType && styles.typeChipActiveDelivery]}
                  onPress={() => setRiderForm({ ...riderForm, vehicleType: vType })}
                >
                  <Text style={[styles.typeChipText, riderForm.vehicleType === vType && styles.typeChipTextActive]}>
                    {vType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Vehicle Number *</Text>
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

            <Text style={styles.label}>Operating Zone</Text>
            <TextInput
              style={styles.inputSimple}
              value={riderForm.zone}
              onChangeText={(val) => setRiderForm({ ...riderForm, zone: val })}
            />

            <TouchableOpacity
              style={[styles.submitBtn, styles.submitBtnDelivery]}
              onPress={handleRiderRegistrationSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Submitting...' : 'Register as Delivery Captain'}
              </Text>
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
    padding: 16,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  roleButtonsWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  roleSelectBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  roleBtnActiveVendor: {
    backgroundColor: '#FB8500',
    borderColor: '#FB8500',
  },
  roleBtnActiveDelivery: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  roleSelectText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  roleSelectTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  formHeaderRow: {
    marginBottom: 14,
  },
  portalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  portalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
  typeChipActiveDelivery: {
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
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitBtnVendor: {
    backgroundColor: '#FB8500',
    shadowColor: '#FB8500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnDelivery: {
    backgroundColor: '#059669',
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
    color: '#FB8500',
    fontWeight: '700',
  },
});
