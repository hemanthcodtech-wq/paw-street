import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ROLE_CONFIGS = {
  customer: {
    key: 'customer',
    label: 'Customer',
    badge: 'PET PARENT',
    icon: '🐾',
    color: '#FF8A00',
    lightBg: '#FFF7ED',
    borderColor: '#FED7AA',
    textColor: '#9A3412',
    buttonColor: '#FF8A00',
    description: 'Shop pet essentials, order vet-approved foods & book pet clinics',
    welcomeLogin: 'Welcome Back, Pet Parent! 🐾',
    welcomeSubLogin: 'Sign in to access your pet profiles, orders & bookings.',
    welcomeSignup: 'Join Paw Street as a Pet Parent 🐶',
    welcomeSubSignup: 'Connect with verified pet clinics, spas & fast doorstep deliveries in Hyderabad.',
    loginBtnText: 'Sign In as Customer 🐾',
    signupBtnText: 'Create Customer Account 🐾',
    defaultEmail: 'customer@thepawstreet.com'
  },
  vendor: {
    key: 'vendor',
    label: 'Vendor Partner',
    badge: 'STORE & CLINIC PARTNER',
    icon: '🏪',
    color: '#059669',
    lightBg: '#F0FDF4',
    borderColor: '#BBF7D0',
    textColor: '#166534',
    buttonColor: '#059669',
    description: 'Manage pet shop inventory, clinical appointments & customer orders',
    welcomeLogin: 'Vendor Partner Portal 🏪',
    welcomeSubLogin: 'Sign in to manage catalog, stock, customer orders & analytics.',
    welcomeSignup: 'Register as Vendor Partner 🏪',
    welcomeSubSignup: 'Complete your step-by-step onboarding for Admin Verification.',
    loginBtnText: 'Sign In as Vendor Partner 🏪',
    signupBtnText: 'Submit Application for Admin Approval 🚀',
    defaultEmail: 'vendor@pawnear.com'
  },
  rider: {
    key: 'rider',
    label: 'Delivery Rider',
    badge: 'DELIVERY FLEET',
    icon: '🏍️',
    color: '#2563EB',
    lightBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1E40AF',
    buttonColor: '#2563EB',
    description: 'Pick up & deliver pet packages across Hyderabad with instant payouts',
    welcomeLogin: 'Rider Fleet Partner 🏍️',
    welcomeSubLogin: 'Sign in to accept deliveries, navigate routes & track your daily earnings.',
    welcomeSignup: 'Join Paw Street Delivery Fleet 🏍️',
    welcomeSubSignup: 'Deliver pet food and emergency supplies with competitive payouts and flexible hours.',
    loginBtnText: 'Sign In as Delivery Rider 🏍️',
    signupBtnText: 'Register as Delivery Rider 🏍️',
    defaultEmail: 'rider@pawnear.com'
  }
};

/**
 * Custom Colored Google Icon
 */
function GoogleIcon() {
  return (
    <View style={styles.googleIconCircle}>
      <Text style={styles.googleIconLetter}>G</Text>
    </View>
  );
}

export default function AuthScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login, loginWithGoogle, register } = useAuth();

  // Active Role: null (shows Role Select) | 'customer' | 'vendor' | 'rider'
  const [selectedRole, setSelectedRole] = useState(null);

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');

  // Login Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Customer / Rider General Sign Up Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [vehicleType, setVehicleType] = useState('Motorcycle');

  // ==========================================
  // Vendor Multi-Step Onboarding Form State
  // ==========================================
  const [vendorStep, setVendorStep] = useState(1);
  const [vendorSubmitted, setVendorSubmitted] = useState(false);
  const [vendorData, setVendorData] = useState({
    // Step 1: Store & Owner
    fullName: '',
    storeName: '',
    phone: '',
    email: '',
    password: '',
    businessTypes: ['Pet Store & Retail'],
    // Step 2: Licence & ID
    storeLicenceNumber: '',
    panNumber: '',
    aadhaarNumber: '',
    gstin: '',
    tradeLicenceUploaded: true,
    panCardUploaded: true,
    aadhaarUploaded: true,
    // Step 3: Bank Account & Settlement
    bankName: 'HDFC Bank Ltd.',
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    upiId: '',
    // Step 4: Location & GPS
    address: 'Plot 42, Road No. 12, Banjara Hills',
    city: 'Hyderabad',
    pincode: '500034',
    landmark: 'Near City Center Mall',
    lat: 17.4156,
    lng: 78.4350,
    gpsCaptured: true,
    // Step 5: Store Photos
    storeFrontUploaded: true,
    interiorUploaded: true,
    logoUploaded: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const isWeb = Platform.OS === 'web';
  const topPadding = isWeb ? spacing.md : Math.max(insets.top, 16);

  // Select a role
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setAuthMode('login');
    setEmail(ROLE_CONFIGS[roleKey].defaultEmail);
    setPassword('PawStreet@123');
    setPhone('');
    setName('');
    setShowPassword(false);
    setVendorStep(1);
    setVendorSubmitted(false);
  };

  // Back to Role Selection Screen
  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  // Handle Login Submit
  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email address.');
      return;
    }
    if (!password) {
      Alert.alert('Required Field', 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, selectedRole);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Login Failed', 'Please verify your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle(selectedRole || 'customer');
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Google Sign-In Failed', 'Unable to authenticate with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Customer / Rider Sign Up Submit
  const handleCustomerRiderSignUp = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Required Field', 'Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        petType,
        vehicleType
      }, selectedRole);

      navigation.replace('MainTabs');
      Alert.alert('Welcome to Paw Street! 🐾', `Account successfully created for ${name}.`);
    } catch (e) {
      Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // Vendor Multi-Step Helper Handlers
  // ==========================================
  const updateVendorField = (field, val) => {
    setVendorData(prev => ({ ...prev, [field]: val }));
  };

  const toggleVendorBusinessType = (type) => {
    setVendorData(prev => {
      const exists = prev.businessTypes.includes(type);
      const updated = exists ? prev.businessTypes.filter(t => t !== type) : [...prev.businessTypes, type];
      return { ...prev, businessTypes: updated.length > 0 ? updated : [type] };
    });
  };

  const validateVendorStep = (step) => {
    switch (step) {
      case 1:
        if (!vendorData.fullName.trim()) {
          Alert.alert('Step 1 Required', 'Please enter Store Owner Full Name.');
          return false;
        }
        if (!vendorData.storeName.trim()) {
          Alert.alert('Step 1 Required', 'Please enter Pet Store / Business Name.');
          return false;
        }
        if (!vendorData.phone.trim()) {
          Alert.alert('Step 1 Required', 'Please enter Contact Phone Number.');
          return false;
        }
        if (!vendorData.email.trim() || !vendorData.email.includes('@')) {
          Alert.alert('Step 1 Required', 'Please enter a valid official Email Address.');
          return false;
        }
        if (!vendorData.password || vendorData.password.length < 6) {
          Alert.alert('Step 1 Required', 'Please create a password of at least 6 characters.');
          return false;
        }
        return true;
      case 2:
        if (!vendorData.storeLicenceNumber.trim()) {
          Alert.alert('Step 2 Required', 'Please enter Store Licence / Municipal Trade Certificate No.');
          return false;
        }
        if (!vendorData.panNumber.trim()) {
          Alert.alert('Step 2 Required', 'Please enter Business PAN Number.');
          return false;
        }
        if (!vendorData.aadhaarNumber.trim()) {
          Alert.alert('Step 2 Required', 'Please enter Aadhaar Card Number.');
          return false;
        }
        return true;
      case 3: {
        const effectiveHolder = (vendorData.accountHolderName || vendorData.fullName || '').trim();
        if (!effectiveHolder) {
          Alert.alert('Step 3 Required', 'Please enter Account Holder Name.');
          return false;
        }
        if (!vendorData.bankName.trim() || !vendorData.accountNumber.trim() || !vendorData.ifscCode.trim()) {
          Alert.alert('Step 3 Required', 'Please enter Bank Name, Account Number and IFSC Code.');
          return false;
        }
        if (vendorData.confirmAccountNumber && vendorData.accountNumber !== vendorData.confirmAccountNumber) {
          Alert.alert('Step 3 Mismatch', 'Bank Account Number and Confirm Account Number do not match.');
          return false;
        }
        if (!vendorData.accountHolderName) {
          setVendorData(prev => ({ ...prev, accountHolderName: effectiveHolder }));
        }
        return true;
      }
      case 4:
        if (!vendorData.address.trim() || !vendorData.city.trim() || !vendorData.pincode.trim()) {
          Alert.alert('Step 4 Required', 'Please provide complete Store Street Address, City, and Pincode.');
          return false;
        }
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleNextVendorStep = (nextStep) => {
    if (nextStep > vendorStep) {
      for (let i = vendorStep; i < nextStep; i++) {
        if (!validateVendorStep(i)) return;
      }
    }
    // Auto-fill account holder with owner name if empty
    if (nextStep === 3 && !vendorData.accountHolderName && vendorData.fullName) {
      setVendorData(prev => ({ ...prev, accountHolderName: prev.fullName }));
    }
    setVendorStep(nextStep);
  };

  // Submit Final Vendor Application for Admin Approval
  const handleSubmitVendorOnboarding = async () => {
    for (let i = 1; i <= 5; i++) {
      if (!validateVendorStep(i)) {
        setVendorStep(i);
        return;
      }
    }

    setIsLoading(true);
    try {
      const effectiveHolder = (vendorData.accountHolderName || vendorData.fullName || '').trim();
      const payload = {
        storeName: vendorData.storeName,
        fullName: vendorData.fullName,
        email: vendorData.email,
        phone: vendorData.phone,
        password: vendorData.password,
        businessTypes: vendorData.businessTypes,
        storeLicenceNumber: vendorData.storeLicenceNumber,
        panNumber: vendorData.panNumber,
        aadhaarNumber: vendorData.aadhaarNumber,
        gstin: vendorData.gstin,
        bankDetails: {
          accountHolderName: effectiveHolder,
          bankName: vendorData.bankName,
          accountNumber: vendorData.accountNumber,
          ifscCode: vendorData.ifscCode,
          upiId: vendorData.upiId
        },
        location: {
          address: vendorData.address,
          city: vendorData.city,
          pincode: vendorData.pincode,
          landmark: vendorData.landmark,
          lat: vendorData.lat,
          lng: vendorData.lng
        },
        status: 'pending'
      };

      await api.submitVendorOnboarding(payload);
      setVendorSubmitted(true);
    } catch (e) {
      Alert.alert('Submission Error', e.message || 'Unable to submit onboarding application.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    navigation.replace('MainTabs');
  };

  const currentRoleConfig = selectedRole ? ROLE_CONFIGS[selectedRole] : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
      >
        {/* ======================================================== */}
        {/* VIEW 1: ROLE SELECTION SCREEN (Appears after Splash)     */}
        {/* ======================================================== */}
        {selectedRole === null ? (
          <View style={styles.roleSelectionContainer}>
            {/* Top Brand Header */}
            <View style={styles.brandHero}>
              <View style={styles.heroLogoRing}>
                <View style={styles.heroLogoInner}>
                  <Text style={{ fontSize: 32 }}>🐾</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>Paw Street</Text>
              <Text style={styles.heroTagline}>Hyperlocal Pet Care, Grooming & Fast Supplies</Text>
              <View style={styles.cityPill}>
                <Ionicons name="location" size={13} color="#D97706" />
                <Text style={styles.cityPillText}>Hyderabad Active Hub</Text>
              </View>
            </View>

            {/* Instruction Title */}
            <View style={styles.selectionPromptBox}>
              <Text style={styles.selectionTitle}>Choose How You Want to Sign In</Text>
              <Text style={styles.selectionSub}>
                Select your role below to access your dedicated dashboard & services:
              </Text>
            </View>

            {/* 3 Prominent Role Action Cards / Buttons */}
            <View style={styles.roleCardStack}>
              {/* 1. LOGIN AS CUSTOMER */}
              <TouchableOpacity
                style={[styles.roleActionCard, { borderColor: ROLE_CONFIGS.customer.borderColor }]}
                onPress={() => handleSelectRole('customer')}
                activeOpacity={0.85}
              >
                <View style={[styles.roleIconBadge, { backgroundColor: ROLE_CONFIGS.customer.lightBg }]}>
                  <Text style={{ fontSize: 28 }}>{ROLE_CONFIGS.customer.icon}</Text>
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.roleTag, { color: ROLE_CONFIGS.customer.textColor, backgroundColor: ROLE_CONFIGS.customer.lightBg }]}>
                      {ROLE_CONFIGS.customer.badge}
                    </Text>
                  </View>
                  <Text style={styles.roleCardTitle}>Login as Customer</Text>
                  <Text style={styles.roleCardDesc}>{ROLE_CONFIGS.customer.description}</Text>
                </View>
                <View style={[styles.roleArrowBtn, { backgroundColor: ROLE_CONFIGS.customer.buttonColor }]}>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* 2. LOGIN AS VENDOR */}
              <TouchableOpacity
                style={[styles.roleActionCard, { borderColor: ROLE_CONFIGS.vendor.borderColor }]}
                onPress={() => handleSelectRole('vendor')}
                activeOpacity={0.85}
              >
                <View style={[styles.roleIconBadge, { backgroundColor: ROLE_CONFIGS.vendor.lightBg }]}>
                  <Text style={{ fontSize: 28 }}>{ROLE_CONFIGS.vendor.icon}</Text>
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.roleTag, { color: ROLE_CONFIGS.vendor.textColor, backgroundColor: ROLE_CONFIGS.vendor.lightBg }]}>
                      {ROLE_CONFIGS.vendor.badge}
                    </Text>
                  </View>
                  <Text style={styles.roleCardTitle}>Login as Vendor</Text>
                  <Text style={styles.roleCardDesc}>{ROLE_CONFIGS.vendor.description}</Text>
                </View>
                <View style={[styles.roleArrowBtn, { backgroundColor: ROLE_CONFIGS.vendor.buttonColor }]}>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* 3. LOGIN AS RIDER */}
              <TouchableOpacity
                style={[styles.roleActionCard, { borderColor: ROLE_CONFIGS.rider.borderColor }]}
                onPress={() => handleSelectRole('rider')}
                activeOpacity={0.85}
              >
                <View style={[styles.roleIconBadge, { backgroundColor: ROLE_CONFIGS.rider.lightBg }]}>
                  <Text style={{ fontSize: 28 }}>{ROLE_CONFIGS.rider.icon}</Text>
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.roleTag, { color: ROLE_CONFIGS.rider.textColor, backgroundColor: ROLE_CONFIGS.rider.lightBg }]}>
                      {ROLE_CONFIGS.rider.badge}
                    </Text>
                  </View>
                  <Text style={styles.roleCardTitle}>Login as Rider</Text>
                  <Text style={styles.roleCardDesc}>{ROLE_CONFIGS.rider.description}</Text>
                </View>
                <View style={[styles.roleArrowBtn, { backgroundColor: ROLE_CONFIGS.rider.buttonColor }]}>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Guest Skip Option */}
            <TouchableOpacity style={styles.exploreGuestBtn} onPress={handleGuestContinue} activeOpacity={0.7}>
              <Text style={styles.exploreGuestText}>Want to explore the catalog first? </Text>
              <Text style={styles.exploreGuestLink}>Continue as Guest ➔</Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </View>
        ) : (
          /* ======================================================== */
          /* VIEW 2: ROLE-SPECIFIC LOGIN / REGISTER SCREEN           */
          /* ======================================================== */
          <View style={styles.authFormContainer}>
            {/* Top Navigation Bar: Back & Role Pill */}
            <View style={styles.formTopBar}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBackToRoles} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
                <Text style={styles.backBtnText}>Change Role</Text>
              </TouchableOpacity>

              <View style={[styles.activeRolePill, { backgroundColor: currentRoleConfig.lightBg, borderColor: currentRoleConfig.borderColor }]}>
                <Text style={{ fontSize: 13, marginRight: 5 }}>{currentRoleConfig.icon}</Text>
                <Text style={[styles.activeRolePillText, { color: currentRoleConfig.textColor }]}>
                  {currentRoleConfig.label}
                </Text>
              </View>
            </View>

            {/* Role Header Banner */}
            <View style={styles.roleBannerBox}>
              <View style={[styles.roleBannerIconBox, { backgroundColor: currentRoleConfig.lightBg }]}>
                <Text style={{ fontSize: 32 }}>{currentRoleConfig.icon}</Text>
              </View>
              <Text style={styles.roleBannerTitle}>
                {authMode === 'login' ? currentRoleConfig.welcomeLogin : currentRoleConfig.welcomeSignup}
              </Text>
              <Text style={styles.roleBannerSub}>
                {authMode === 'login' ? currentRoleConfig.welcomeSubLogin : currentRoleConfig.welcomeSubSignup}
              </Text>
            </View>

            {/* Mode Switch Tabs (Sign In vs Sign Up) */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, authMode === 'login' && styles.modeTabActive]}
                onPress={() => setAuthMode('login')}
              >
                <Text style={[styles.modeTabText, authMode === 'login' && styles.modeTabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, authMode === 'signup' && styles.modeTabActive]}
                onPress={() => setAuthMode('signup')}
              >
                <Text style={[styles.modeTabText, authMode === 'signup' && styles.modeTabTextActive]}>
                  {selectedRole === 'vendor' ? 'Register as Vendor' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* =================================================== */}
            {/* 1. LOGIN FORM (Common for Customer, Vendor, Rider)  */}
            {/* =================================================== */}
            {authMode === 'login' && (
              <View style={styles.formCard}>
                {/* Email Field */}
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="mail" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Field */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Password Reset', `Password reset instructions sent to ${email || 'your email'}.`)}>
                    <Text style={styles.forgotPassLink}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputBox}>
                  <Ionicons name="lock-closed" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Submit Sign In Button */}
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: currentRoleConfig.buttonColor }]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>{currentRoleConfig.loginBtnText}</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign In With Google Button */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={handleGoogleAuth}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <GoogleIcon />
                  <Text style={styles.googleBtnText}>Sign in with Google</Text>
                </TouchableOpacity>

                {/* Bottom Toggle Link to Sign Up */}
                <View style={styles.toggleFooter}>
                  <Text style={styles.toggleFooterText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => setAuthMode('signup')}>
                    <Text style={[styles.toggleFooterLink, { color: currentRoleConfig.buttonColor }]}>
                      {selectedRole === 'vendor' ? 'Register as Vendor Partner ➔' : `Sign Up as ${currentRoleConfig.label}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* =============================================================== */}
            {/* 2. CUSTOMER & RIDER SIGN UP (Direct Single Step)                */}
            {/* =============================================================== */}
            {authMode === 'signup' && selectedRole !== 'vendor' && (
              <View style={styles.formCard}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="person" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Customer Pet Companion Type */}
                {selectedRole === 'customer' && (
                  <>
                    <Text style={styles.inputLabel}>PRIMARY PET COMPANION</Text>
                    <View style={styles.chipRow}>
                      {[
                        { id: 'Dog', icon: '🐶' },
                        { id: 'Cat', icon: '🐱' },
                        { id: 'Bird', icon: '🦜' },
                        { id: 'Fish', icon: '🐠' }
                      ].map((p) => {
                        const isSelected = petType === p.id;
                        return (
                          <TouchableOpacity
                            key={p.id}
                            style={[styles.chipItem, isSelected && { backgroundColor: currentRoleConfig.buttonColor, borderColor: currentRoleConfig.buttonColor }]}
                            onPress={() => setPetType(p.id)}
                          >
                            <Text style={{ fontSize: 13, marginRight: 4 }}>{p.icon}</Text>
                            <Text style={[styles.chipItemText, isSelected && { color: '#FFFFFF', fontWeight: '800' }]}>
                              {p.id}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}

                {/* Rider Vehicle Type */}
                {selectedRole === 'rider' && (
                  <>
                    <Text style={styles.inputLabel}>DELIVERY VEHICLE TYPE</Text>
                    <View style={styles.chipRow}>
                      {[
                        { id: 'Motorcycle', icon: '🏍️' },
                        { id: 'Scooter', icon: '🛵' },
                        { id: 'Electric EV', icon: '⚡' }
                      ].map((v) => {
                        const isSelected = vehicleType === v.id;
                        return (
                          <TouchableOpacity
                            key={v.id}
                            style={[styles.chipItem, isSelected && { backgroundColor: currentRoleConfig.buttonColor, borderColor: currentRoleConfig.buttonColor }]}
                            onPress={() => setVehicleType(v.id)}
                          >
                            <Text style={{ fontSize: 13, marginRight: 4 }}>{v.icon}</Text>
                            <Text style={[styles.chipItemText, isSelected && { color: '#FFFFFF', fontWeight: '800' }]}>
                              {v.id}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}

                {/* Email Address */}
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="mail" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Mobile Number */}
                <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.phonePrefix}>+91</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="98765 43210"
                    placeholderTextColor={colors.textMuted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                {/* Password */}
                <Text style={styles.inputLabel}>CREATE PASSWORD</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="lock-closed" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Submit Sign Up Button */}
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: currentRoleConfig.buttonColor }]}
                  onPress={handleCustomerRiderSignUp}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>{currentRoleConfig.signupBtnText}</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign Up With Google Button */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={handleGoogleAuth}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <GoogleIcon />
                  <Text style={styles.googleBtnText}>Sign up with Google</Text>
                </TouchableOpacity>

                {/* Bottom Toggle Link to Sign In */}
                <View style={styles.toggleFooter}>
                  <Text style={styles.toggleFooterText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => setAuthMode('login')}>
                    <Text style={[styles.toggleFooterLink, { color: currentRoleConfig.buttonColor }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* =============================================================== */}
            {/* 3. VENDOR STEP-BY-STEP ONBOARDING WIZARD (Matching Website)     */}
            {/* =============================================================== */}
            {authMode === 'signup' && selectedRole === 'vendor' && (
              <View style={styles.vendorWizardWrapper}>
                {/* SUBMITTED STATE: UNDER ADMIN REVIEW */}
                {vendorSubmitted ? (
                  <View style={styles.submittedCard}>
                    <View style={styles.submittedIconBox}>
                      <Ionicons name="time" size={42} color="#D97706" />
                    </View>

                    <View style={styles.reviewBadge}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.reviewBadgeText}>UNDER ADMIN REVIEW</Text>
                    </View>

                    <Text style={styles.submittedTitle}>Application Submitted for Admin Approval!</Text>
                    <Text style={styles.submittedDesc}>
                      Thank you, <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{vendorData.fullName || 'Partner'}</Text>.
                      Your onboarding application for <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{vendorData.storeName || 'Store'}</Text> has been submitted to the PAW NEAR compliance team.
                    </Text>

                    <View style={styles.appSummaryCard}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Application ID</Text>
                        <Text style={styles.summaryVal}>APP-VND-{Date.now().toString().slice(-6)}</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Store Category</Text>
                        <Text style={styles.summaryVal}>{vendorData.businessTypes.join(', ')}</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Verification Status</Text>
                        <Text style={[styles.summaryVal, { color: '#D97706', fontWeight: '800' }]}>Pending Approval</Text>
                      </View>
                      <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.summaryLabel}>Estimated Time</Text>
                        <Text style={styles.summaryVal}>2 - 4 Business Hours</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: '#059669', width: '100%', marginTop: 10 }]}
                      onPress={() => {
                        setAuthMode('login');
                        setVendorSubmitted(false);
                        setVendorStep(1);
                      }}
                    >
                      <Text style={styles.primaryBtnText}>Back to Vendor Sign In ➔</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.exploreGuestBtn} onPress={handleGuestContinue}>
                      <Text style={styles.exploreGuestLink}>Explore App as Guest</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* MULTI-STEP WIZARD (Steps 1 to 6) */
                  <View style={styles.formCard}>
                    {/* Step Progress Tracker */}
                    <View style={styles.stepProgressBar}>
                      <View style={styles.stepPillsHeader}>
                        <Text style={styles.stepNumberBadge}>STEP {vendorStep} OF 6</Text>
                        <Text style={styles.stepNameHeader}>
                          {vendorStep === 1 && 'Store & Owner Info'}
                          {vendorStep === 2 && 'Licence, PAN & Aadhaar'}
                          {vendorStep === 3 && 'Bank & Payout Settlement'}
                          {vendorStep === 4 && 'Store Geolocation & Address'}
                          {vendorStep === 5 && 'Store Photographs'}
                          {vendorStep === 6 && 'Review & Admin Submission'}
                        </Text>
                      </View>

                      {/* Step Indicator Bars */}
                      <View style={styles.stepTrack}>
                        {[1, 2, 3, 4, 5, 6].map((st) => (
                          <View
                            key={st}
                            style={[
                              styles.stepTrackSegment,
                              st <= vendorStep && { backgroundColor: '#059669' }
                            ]}
                          />
                        ))}
                      </View>
                    </View>

                    {/* ---------------------------------------------------- */}
                    {/* STEP 1: Store & Owner Basic Info                     */}
                    {/* ---------------------------------------------------- */}
                    {vendorStep === 1 && (
                      <View style={styles.stepSection}>
                        <Text style={styles.stepSectionTitle}>Store Owner & Contact Info</Text>
                        <Text style={styles.stepSectionSub}>Enter your business details for official merchant registration.</Text>

                        <Text style={styles.inputLabel}>STORE OWNER FULL NAME *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="person" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. Rajesh Sharma"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.fullName}
                            onChangeText={(t) => updateVendorField('fullName', t)}
                          />
                        </View>

                        <Text style={styles.inputLabel}>PET STORE / CLINIC / SPA NAME *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="storefront" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. Hyderabad Pet Care & Clinic"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.storeName}
                            onChangeText={(t) => updateVendorField('storeName', t)}
                          />
                        </View>

                        {/* Multi-Service Selection */}
                        <Text style={styles.inputLabel}>BUSINESS SERVICES OFFERED *</Text>
                        <View style={styles.chipRow}>
                          {[
                            'Pet Store & Retail',
                            'Pet Grooming & Spa',
                            'Pet Clinic & Vet',
                            'Day Boarding & Hostel'
                          ].map((cat) => {
                            const isSelected = vendorData.businessTypes.includes(cat);
                            return (
                              <TouchableOpacity
                                key={cat}
                                style={[styles.chipItem, isSelected && { backgroundColor: '#059669', borderColor: '#059669' }]}
                                onPress={() => toggleVendorBusinessType(cat)}
                              >
                                <Ionicons
                                  name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                                  size={14}
                                  color={isSelected ? '#FFFFFF' : colors.textSecondary}
                                  style={{ marginRight: 5 }}
                                />
                                <Text style={[styles.chipItemText, isSelected && { color: '#FFFFFF', fontWeight: '800' }]}>
                                  {cat}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        <Text style={styles.inputLabel}>OFFICIAL EMAIL ADDRESS *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="mail" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="vendor@pawnear.com"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.email}
                            onChangeText={(t) => updateVendorField('email', t)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>

                        <Text style={styles.inputLabel}>CONTACT PHONE NUMBER *</Text>
                        <View style={styles.inputBox}>
                          <Text style={styles.phonePrefix}>+91</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="98765 43210"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.phone}
                            onChangeText={(t) => updateVendorField('phone', t)}
                            keyboardType="phone-pad"
                            maxLength={10}
                          />
                        </View>

                        <Text style={styles.inputLabel}>CREATE PASSWORD *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="lock-closed" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="Min 6 characters"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.password}
                            onChangeText={(t) => updateVendorField('password', t)}
                            secureTextEntry={!showPassword}
                          />
                          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={[styles.primaryBtn, { backgroundColor: '#059669' }]}
                          onPress={() => handleNextVendorStep(2)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.primaryBtnText}>Proceed to Licence & ID (Step 2) ➔</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* STEP 2: Store Licence, PAN & Aadhaar                 */}
                    {/* ---------------------------------------------------- */}
                    {vendorStep === 2 && (
                      <View style={styles.stepSection}>
                        <Text style={styles.stepSectionTitle}>Store Licence, PAN & Aadhaar</Text>
                        <Text style={styles.stepSectionSub}>Verification details for municipal trade approvals & compliant payouts.</Text>

                        <Text style={styles.inputLabel}>STORE LICENCE / TRADE CERTIFICATE NO. *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="document-text" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. DL-PET-2026-88492"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.storeLicenceNumber}
                            onChangeText={(t) => updateVendorField('storeLicenceNumber', t)}
                          />
                        </View>

                        <Text style={styles.inputLabel}>BUSINESS PAN NUMBER *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="card" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. ABCDE1234F"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.panNumber}
                            onChangeText={(t) => updateVendorField('panNumber', t.toUpperCase())}
                            autoCapitalize="characters"
                            maxLength={10}
                          />
                        </View>

                        <Text style={styles.inputLabel}>AADHAAR CARD NUMBER *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="finger-print" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. 1234 5678 9012"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.aadhaarNumber}
                            onChangeText={(t) => updateVendorField('aadhaarNumber', t)}
                            keyboardType="numeric"
                            maxLength={14}
                          />
                        </View>

                        <Text style={styles.inputLabel}>GSTIN (OPTIONAL)</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="receipt" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. 36AAAAA0000A1Z5"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.gstin}
                            onChangeText={(t) => updateVendorField('gstin', t.toUpperCase())}
                            autoCapitalize="characters"
                          />
                        </View>

                        {/* KYC Document Verification Badges */}
                        <Text style={styles.inputLabel}>MANDATORY KYC DOCUMENTS (AUTO-VERIFIED)</Text>
                        <View style={styles.docVerifyGrid}>
                          <View style={styles.docVerifyItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#059669" />
                            <Text style={styles.docVerifyText}>Trade Licence Copy</Text>
                          </View>
                          <View style={styles.docVerifyItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#059669" />
                            <Text style={styles.docVerifyText}>PAN Card Copy</Text>
                          </View>
                          <View style={styles.docVerifyItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#059669" />
                            <Text style={styles.docVerifyText}>Aadhaar Document</Text>
                          </View>
                        </View>

                        <View style={styles.stepBtnRow}>
                          <TouchableOpacity style={styles.stepBackBtn} onPress={() => setVendorStep(1)}>
                            <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                            <Text style={styles.stepBackBtnText}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepNextBtn, { backgroundColor: '#059669' }]}
                            onPress={() => handleNextVendorStep(3)}
                          >
                            <Text style={styles.primaryBtnText}>Proceed to Bank (Step 3) ➔</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* STEP 3: Bank Account & Payout Settlement             */}
                    {/* ---------------------------------------------------- */}
                    {vendorStep === 3 && (
                      <View style={styles.stepSection}>
                        <Text style={styles.stepSectionTitle}>Bank Account & Payout Settlement</Text>
                        <Text style={styles.stepSectionSub}>Provide your verified bank details for automated customer order payouts.</Text>

                        {/* Quick Bank Selector Pills */}
                        <Text style={styles.inputLabel}>QUICK SELECT COMMON BANKS</Text>
                        <View style={styles.chipRow}>
                          {['HDFC Bank Ltd.', 'State Bank of India', 'ICICI Bank Ltd.', 'Axis Bank', 'Kotak Mahindra Bank'].map((b) => {
                            const isSelected = vendorData.bankName === b;
                            return (
                              <TouchableOpacity
                                key={b}
                                style={[styles.chipItem, isSelected && { backgroundColor: '#059669', borderColor: '#059669' }]}
                                onPress={() => updateVendorField('bankName', b)}
                              >
                                <Text style={[styles.chipItemText, isSelected && { color: '#FFFFFF', fontWeight: '800' }]}>
                                  {b}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        <Text style={styles.inputLabel}>ACCOUNT HOLDER NAME (AS PER BANK) *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="person" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. Rajesh Sharma"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.accountHolderName || vendorData.fullName}
                            onChangeText={(t) => updateVendorField('accountHolderName', t)}
                          />
                        </View>

                        <Text style={styles.inputLabel}>BANK NAME *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="business" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. HDFC Bank Ltd."
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.bankName}
                            onChangeText={(t) => updateVendorField('bankName', t)}
                          />
                        </View>

                        <Text style={styles.inputLabel}>BANK ACCOUNT NUMBER *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="card" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="Enter account number"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.accountNumber}
                            onChangeText={(t) => updateVendorField('accountNumber', t)}
                            secureTextEntry
                            keyboardType="numeric"
                          />
                        </View>

                        <Text style={styles.inputLabel}>RE-ENTER ACCOUNT NUMBER (CONFIRM) *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="card" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="Confirm account number"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.confirmAccountNumber}
                            onChangeText={(t) => updateVendorField('confirmAccountNumber', t)}
                            keyboardType="numeric"
                          />
                        </View>

                        <Text style={styles.inputLabel}>BANK IFSC CODE *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="keypad" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. HDFC0001248"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.ifscCode}
                            onChangeText={(t) => updateVendorField('ifscCode', t.toUpperCase())}
                            autoCapitalize="characters"
                            maxLength={11}
                          />
                        </View>

                        <Text style={styles.inputLabel}>UPI VPA ID (FOR INSTANT SETTLEMENTS)</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="flash" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. 9876543210@ybl"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.upiId}
                            onChangeText={(t) => updateVendorField('upiId', t)}
                            autoCapitalize="none"
                          />
                        </View>

                        <View style={styles.guaranteeNoticeBox}>
                          <Ionicons name="shield-checkmark" size={18} color="#059669" />
                          <Text style={styles.guaranteeNoticeText}>
                            <Text style={{ fontWeight: '800' }}>Direct Payout Guarantee: </Text>
                            Earnings minus commission are transferred directly to this account via IMPS/NEFT cycles.
                          </Text>
                        </View>

                        <View style={styles.stepBtnRow}>
                          <TouchableOpacity style={styles.stepBackBtn} onPress={() => setVendorStep(2)}>
                            <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                            <Text style={styles.stepBackBtnText}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepNextBtn, { backgroundColor: '#059669' }]}
                            onPress={() => handleNextVendorStep(4)}
                          >
                            <Text style={styles.primaryBtnText}>Proceed to Location (Step 4) ➔</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* STEP 4: Store Geolocation & Address                  */}
                    {/* ---------------------------------------------------- */}
                    {vendorStep === 4 && (
                      <View style={styles.stepSection}>
                        <Text style={styles.stepSectionTitle}>Store Geolocation & Address</Text>
                        <Text style={styles.stepSectionSub}>Accurate location allows nearby pet parents to discover your store and order fast delivery.</Text>

                        <Text style={styles.inputLabel}>STREET ADDRESS *</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="location" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. Plot 42, Road No. 12, Banjara Hills"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.address}
                            onChangeText={(t) => updateVendorField('address', t)}
                          />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.inputLabel}>CITY *</Text>
                            <View style={styles.inputBox}>
                              <TextInput
                                style={styles.input}
                                placeholder="Hyderabad"
                                placeholderTextColor={colors.textMuted}
                                value={vendorData.city}
                                onChangeText={(t) => updateVendorField('city', t)}
                              />
                            </View>
                          </View>

                          <View style={{ flex: 1 }}>
                            <Text style={styles.inputLabel}>PINCODE *</Text>
                            <View style={styles.inputBox}>
                              <TextInput
                                style={styles.input}
                                placeholder="500034"
                                placeholderTextColor={colors.textMuted}
                                value={vendorData.pincode}
                                onChangeText={(t) => updateVendorField('pincode', t)}
                                keyboardType="numeric"
                                maxLength={6}
                              />
                            </View>
                          </View>
                        </View>

                        <Text style={styles.inputLabel}>NEARBY LANDMARK</Text>
                        <View style={styles.inputBox}>
                          <Ionicons name="navigate" size={17} color={colors.textSecondary} style={{ marginRight: 10 }} />
                          <TextInput
                            style={styles.input}
                            placeholder="e.g. Opposite City Center Mall"
                            placeholderTextColor={colors.textMuted}
                            value={vendorData.landmark}
                            onChangeText={(t) => updateVendorField('landmark', t)}
                          />
                        </View>

                        {/* Real-time GPS Location Trigger */}
                        <View style={styles.gpsCardBox}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <Ionicons name="navigate-circle" size={24} color="#059669" />
                            <Text style={styles.gpsCardTitle}>GPS Real-Time Location Capture</Text>
                          </View>
                          <Text style={styles.gpsCardDesc}>
                            Captured Coordinates: <Text style={{ fontWeight: '800', color: colors.textPrimary }}>17.4156° N, 78.4350° E</Text> (Banjara Hills, Hyderabad Hub)
                          </Text>
                          <View style={styles.gpsBadgeSuccess}>
                            <Ionicons name="checkmark-circle" size={14} color="#059669" />
                            <Text style={styles.gpsBadgeText}>High-Accuracy Location Verified</Text>
                          </View>
                        </View>

                        <View style={styles.stepBtnRow}>
                          <TouchableOpacity style={styles.stepBackBtn} onPress={() => setVendorStep(3)}>
                            <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                            <Text style={styles.stepBackBtnText}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepNextBtn, { backgroundColor: '#059669' }]}
                            onPress={() => handleNextVendorStep(5)}
                          >
                            <Text style={styles.primaryBtnText}>Proceed to Photos (Step 5) ➔</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* STEP 5: Store Photographs                            */}
                    {/* ---------------------------------------------------- */}
                    {vendorStep === 5 && (
                      <View style={styles.stepSection}>
                        <Text style={styles.stepSectionTitle}>Store & Clinic Photographs</Text>
                        <Text style={styles.stepSectionSub}>High-quality store photos build confidence and trust with pet parents.</Text>

                        <View style={styles.photoUploadList}>
                          {/* Storefront */}
                          <View style={styles.photoBox}>
                            <View style={styles.photoThumbPlaceholder}>
                              <Ionicons name="storefront" size={28} color="#059669" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.photoTitle}>Storefront Exterior Photo</Text>
                              <Text style={styles.photoSub}>Clear street view showing signage board</Text>
                              <View style={styles.photoUploadedBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                                <Text style={styles.photoUploadedText}>Uploaded & Verified ✓</Text>
                              </View>
                            </View>
                          </View>

                          {/* Interior */}
                          <View style={styles.photoBox}>
                            <View style={styles.photoThumbPlaceholder}>
                              <Ionicons name="images" size={28} color="#059669" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.photoTitle}>Store Interior / Clinic Facility</Text>
                              <Text style={styles.photoSub}>Showcasing clean shelves & medical rooms</Text>
                              <View style={styles.photoUploadedBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                                <Text style={styles.photoUploadedText}>Uploaded & Verified ✓</Text>
                              </View>
                            </View>
                          </View>

                          {/* Logo */}
                          <View style={styles.photoBox}>
                            <View style={styles.photoThumbPlaceholder}>
                              <Ionicons name="paw" size={28} color="#059669" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.photoTitle}>Store / Clinic Brand Logo</Text>
                              <Text style={styles.photoSub}>Square image for customer app listings</Text>
                              <View style={styles.photoUploadedBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                                <Text style={styles.photoUploadedText}>Uploaded & Verified ✓</Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.stepBtnRow}>
                          <TouchableOpacity style={styles.stepBackBtn} onPress={() => setVendorStep(4)}>
                            <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                            <Text style={styles.stepBackBtnText}>Back</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepNextBtn, { backgroundColor: '#059669' }]}
                            onPress={() => handleNextVendorStep(6)}
                          >
                            <Text style={styles.primaryBtnText}>Review & Submit (Step 6) ➔</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* ---------------------------------------------------- */}
                    {/* STEP 6: Review Application & Submit for Approval    */}
                    {/* ---------------------------------------------------- */}
                    {vendorStep === 6 && (
                      <View style={styles.stepSection}>
                        <Text style={styles.stepSectionTitle}>Review & Submit Application</Text>
                        <Text style={styles.stepSectionSub}>Please review all verified merchant information before final submission for Admin Approval.</Text>

                        {/* Review Summary Card */}
                        <View style={styles.reviewSummaryCard}>
                          <View style={styles.reviewHeaderRow}>
                            <Text style={{ fontSize: 24, marginRight: 8 }}>🏪</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.reviewStoreName}>{vendorData.storeName || 'Paws & Whiskers'}</Text>
                              <Text style={styles.reviewOwnerName}>Owner: {vendorData.fullName}</Text>
                            </View>
                            <View style={styles.readyBadge}>
                              <Text style={styles.readyBadgeText}>READY TO SUBMIT</Text>
                            </View>
                          </View>

                          <View style={styles.reviewDetailItem}>
                            <Text style={styles.reviewLabel}>Services Offered:</Text>
                            <Text style={styles.reviewValue}>{vendorData.businessTypes.join(', ')}</Text>
                          </View>
                          <View style={styles.reviewDetailItem}>
                            <Text style={styles.reviewLabel}>Contact Details:</Text>
                            <Text style={styles.reviewValue}>{vendorData.email} • +91 {vendorData.phone}</Text>
                          </View>
                          <View style={styles.reviewDetailItem}>
                            <Text style={styles.reviewLabel}>Licence & KYC:</Text>
                            <Text style={styles.reviewValue}>{vendorData.storeLicenceNumber} (PAN: {vendorData.panNumber})</Text>
                          </View>
                          <View style={styles.reviewDetailItem}>
                            <Text style={styles.reviewLabel}>Settlement Bank:</Text>
                            <Text style={styles.reviewValue}>{vendorData.bankName} (IFSC: {vendorData.ifscCode})</Text>
                          </View>
                          <View style={[styles.reviewDetailItem, { borderBottomWidth: 0 }]}>
                            <Text style={styles.reviewLabel}>Store Address:</Text>
                            <Text style={styles.reviewValue}>{vendorData.address}, {vendorData.city} - {vendorData.pincode}</Text>
                          </View>
                        </View>

                        {/* Submit Application Button */}
                        <TouchableOpacity
                          style={[styles.primaryBtn, { backgroundColor: '#059669', paddingVertical: 16 }]}
                          onPress={handleSubmitVendorOnboarding}
                          disabled={isLoading}
                          activeOpacity={0.85}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                          ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                              <Text style={styles.primaryBtnText}>Submit Application for Admin Approval 🚀</Text>
                            </View>
                          )}
                        </TouchableOpacity>

                        <View style={styles.stepBtnRow}>
                          <TouchableOpacity style={styles.stepBackBtn} onPress={() => setVendorStep(5)}>
                            <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                            <Text style={styles.stepBackBtnText}>Back to Photos</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Bottom link to Sign In */}
                    <View style={styles.toggleFooter}>
                      <Text style={styles.toggleFooterText}>Already have an account? </Text>
                      <TouchableOpacity onPress={() => setAuthMode('login')}>
                        <Text style={[styles.toggleFooterLink, { color: '#059669' }]}>Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={{ height: 40 }} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },

  // ----------------------------------------------------
  // VIEW 1: ROLE SELECTION SCREEN STYLES
  // ----------------------------------------------------
  roleSelectionContainer: {
    flex: 1,
    paddingTop: 10,
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroLogoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroLogoInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    gap: 4,
  },
  cityPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  selectionPromptBox: {
    marginBottom: 18,
    alignItems: 'center',
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  selectionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  roleCardStack: {
    gap: 14,
  },
  roleActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  roleTag: {
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  roleCardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  roleArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreGuestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    paddingVertical: 10,
  },
  exploreGuestText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  exploreGuestLink: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  // ----------------------------------------------------
  // VIEW 2: ROLE LOGIN / REGISTER FORM STYLES
  // ----------------------------------------------------
  authFormContainer: {
    flex: 1,
  },
  formTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 2,
  },
  activeRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeRolePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  roleBannerBox: {
    alignItems: 'center',
    marginBottom: 18,
  },
  roleBannerIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleBannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  roleBannerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTabTextActive: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.7,
    marginBottom: 6,
    marginTop: 10,
  },
  forgotPassLink: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 8,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  phonePrefix: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginRight: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chipItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  primaryBtn: {
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E5E7EB',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  googleIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleIconLetter: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  googleBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#374151',
  },
  toggleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  toggleFooterText: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  toggleFooterLink: {
    fontSize: 12.5,
    fontWeight: '800',
  },

  // ----------------------------------------------------
  // VENDOR MULTI-STEP ONBOARDING STYLES
  // ----------------------------------------------------
  vendorWizardWrapper: {
    flex: 1,
  },
  stepProgressBar: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepPillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberBadge: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  stepNameHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stepTrack: {
    flexDirection: 'row',
    gap: 4,
  },
  stepTrackSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  stepSection: {
    flex: 1,
  },
  stepSectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepSectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
    lineHeight: 17,
  },
  stepBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  stepBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  stepBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepNextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docVerifyGrid: {
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  docVerifyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  docVerifyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  guaranteeNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    gap: 8,
  },
  guaranteeNoticeText: {
    flex: 1,
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
  },
  gpsCardBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  gpsCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  gpsCardDesc: {
    fontSize: 11.5,
    color: '#166534',
    marginBottom: 8,
  },
  gpsBadgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  gpsBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803D',
  },
  photoUploadList: {
    gap: 12,
  },
  photoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  photoThumbPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  photoSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  photoUploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  photoUploadedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  reviewSummaryCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 10,
  },
  reviewStoreName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  reviewOwnerName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  readyBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  readyBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  reviewDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  reviewValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  // ----------------------------------------------------
  // SUBMITTED STATE STYLES (MATCHES WEBSITE)
  // ----------------------------------------------------
  submittedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  submittedIconBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  reviewBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  submittedTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  submittedDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  appSummaryCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
