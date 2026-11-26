import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const DOMESTIC_ROUTES = [
  'Hyderabad -> Bangalore',
  'Hyderabad -> Mumbai',
  'Hyderabad -> Delhi NCR',
  'Hyderabad -> Chennai',
  'Bangalore -> Mumbai',
  'Custom Route'
];

const INTERNATIONAL_DESTINATIONS = [
  'USA & Canada',
  'United Kingdom (UK)',
  'European Union (EU)',
  'United Arab Emirates (Dubai)',
  'Singapore / Australia',
  'Other Country'
];

export default function PetRelocationModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const [relocationType, setRelocationType] = useState('domestic'); // 'domestic' | 'international'
  const [transportMode, setTransportMode] = useState('flight'); // 'flight' | 'cab'
  const [originCity, setOriginCity] = useState('Hyderabad');
  const [destCity, setDestCity] = useState('');
  const [petType, setPetType] = useState('dog');
  const [petWeight, setPetWeight] = useState('12'); // kg
  const [needsIataCrate, setNeedsIataCrate] = useState(true);
  const [needsHealthCert, setNeedsHealthCert] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bookingPlaced, setBookingPlaced] = useState(false);

  // Dynamic estimate calculation
  const calculateEstimate = () => {
    let base = relocationType === 'international' ? 45000 : 7500;
    if (transportMode === 'flight' && relocationType === 'domestic') base = 9800;
    if (transportMode === 'cab') base = 6200;

    const weightNum = parseFloat(petWeight) || 10;
    const weightFee = relocationType === 'international' ? weightNum * 850 : weightNum * 120;
    const crateFee = needsIataCrate ? (relocationType === 'international' ? 4500 : 2200) : 0;
    const healthCertFee = needsHealthCert ? (relocationType === 'international' ? 6500 : 950) : 0;

    return Math.round(base + weightFee + crateFee + healthCertFee);
  };

  const estimatedCost = calculateEstimate();

  const handleInquirySubmit = () => {
    if (!destCity.trim() || !contactPhone.trim()) {
      Alert.alert('Missing Details', 'Please provide Destination City and Contact Phone Number.');
      return;
    }

    setBookingPlaced(true);
  };

  const resetAndClose = () => {
    setBookingPlaced(false);
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 16) + 14 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <Ionicons name="airplane" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Global & Domestic Pet Relocation</Text>
                <Text style={styles.headerSub}>Stress-Free Doorstep Pet Travel & Air Cargo</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {bookingPlaced ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-done" size={48} color="#FFF" />
              </View>
              <Text style={styles.successTitle}>Relocation Request Received!</Text>
              <Text style={styles.successDesc}>
                Our Certified Pet Relocation Officer has assigned ticket #{Math.floor(100000 + Math.random() * 900000)}.
                We will call you on {contactPhone || '+91'} within 30 minutes with the customized flight itinerary & quarantine clearance roadmap.
              </Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryRoute}>
                  {originCity} ➔ {destCity} ({relocationType.toUpperCase()})
                </Text>
                <Text style={styles.summaryEstimate}>Est. Quote: ₹{estimatedCost.toLocaleString('en-IN')}</Text>
                <Text style={styles.summaryNote}>Includes IATA crate recommendation & vet checkup assistance.</Text>
              </View>
              <TouchableOpacity style={styles.primaryBtn} onPress={resetAndClose}>
                <Text style={styles.primaryBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              {/* Type Switcher */}
              <View style={styles.typeSwitcher}>
                <TouchableOpacity
                  style={[styles.typeTab, relocationType === 'domestic' && styles.typeTabActive]}
                  onPress={() => setRelocationType('domestic')}
                >
                  <Ionicons
                    name="car-sport"
                    size={16}
                    color={relocationType === 'domestic' ? '#FFF' : colors.textSecondary}
                  />
                  <Text style={[styles.typeTabText, relocationType === 'domestic' && styles.typeTabTextActive]}>
                    Domestic Intercity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeTab, relocationType === 'international' && styles.typeTabActive]}
                  onPress={() => setRelocationType('international')}
                >
                  <Ionicons
                    name="globe"
                    size={16}
                    color={relocationType === 'international' ? '#FFF' : colors.textSecondary}
                  />
                  <Text style={[styles.typeTabText, relocationType === 'international' && styles.typeTabTextActive]}>
                    Global International
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Highlights Pill */}
              <View style={styles.highlightBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#0D9488" />
                <Text style={styles.highlightText}>
                  {relocationType === 'domestic'
                    ? 'Doorstep pickup, AC climate cab or IATA pet air ticket'
                    : 'IATA Approved Pet Crates • Microchipping • Rabies Titer • Customs'}
                </Text>
              </View>

              {/* Origin & Destination */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Route Details</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputFlex}>
                    <Text style={styles.inputSubLabel}>Origin City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={originCity}
                      onChangeText={setOriginCity}
                      placeholder="e.g. Hyderabad"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={colors.textSecondary} style={{ marginTop: 26 }} />
                  <View style={styles.inputFlex}>
                    <Text style={styles.inputSubLabel}>Destination</Text>
                    <TextInput
                      style={styles.textInput}
                      value={destCity}
                      onChangeText={setDestCity}
                      placeholder={relocationType === 'domestic' ? 'e.g. Bangalore' : 'e.g. London / Dubai'}
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {/* Popular routes chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                  {(relocationType === 'domestic' ? DOMESTIC_ROUTES : INTERNATIONAL_DESTINATIONS).map((dest, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.chip}
                      onPress={() => {
                        if (relocationType === 'domestic') {
                          const parts = dest.split(' -> ');
                          if (parts.length === 2) {
                            setOriginCity(parts[0]);
                            setDestCity(parts[1]);
                          }
                        } else {
                          setDestCity(dest);
                        }
                      }}
                    >
                      <Text style={styles.chipText}>{dest}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Mode Selection */}
              {relocationType === 'domestic' && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Preferred Travel Mode</Text>
                  <View style={styles.modeRow}>
                    <TouchableOpacity
                      style={[styles.modeCard, transportMode === 'flight' && styles.modeCardActive]}
                      onPress={() => setTransportMode('flight')}
                    >
                      <Ionicons
                        name="airplane-outline"
                        size={22}
                        color={transportMode === 'flight' ? colors.primary : colors.textSecondary}
                      />
                      <Text style={[styles.modeTitle, transportMode === 'flight' && styles.modeTitleActive]}>
                        Air Cargo Pet Flight
                      </Text>
                      <Text style={styles.modeDesc}>Fastest • 2-4 hrs transit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modeCard, transportMode === 'cab' && styles.modeCardActive]}
                      onPress={() => setTransportMode('cab')}
                    >
                      <Ionicons
                        name="car-outline"
                        size={22}
                        color={transportMode === 'cab' ? colors.primary : colors.textSecondary}
                      />
                      <Text style={[styles.modeTitle, transportMode === 'cab' && styles.modeTitleActive]}>
                        Dedicated Pet Cab
                      </Text>
                      <Text style={styles.modeDesc}>Doorstep • AC with potty breaks</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Pet Details */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Pet Profile & Weight</Text>
                <View style={styles.petTypeRow}>
                  {['dog', 'cat', 'other'].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.petTypeBtn, petType === t && styles.petTypeBtnActive]}
                      onPress={() => setPetType(t)}
                    >
                      <Text style={[styles.petTypeBtnText, petType === t && styles.petTypeBtnTextActive]}>
                        {t === 'dog' ? '🐶 Dog' : t === 'cat' ? '🐱 Cat' : '🦜 Other'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.weightRow}>
                  <Text style={styles.inputSubLabel}>Approximate Pet Weight (KG):</Text>
                  <View style={styles.weightInputBox}>
                    <TextInput
                      style={styles.weightInput}
                      keyboardType="numeric"
                      value={petWeight}
                      onChangeText={setPetWeight}
                    />
                    <Text style={styles.weightUnit}>kg</Text>
                  </View>
                </View>
              </View>

              {/* Add-ons */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Essential Relocation Add-ons</Text>
                <TouchableOpacity
                  style={styles.addonItem}
                  onPress={() => setNeedsIataCrate(!needsIataCrate)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={needsIataCrate ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={needsIataCrate ? colors.primary : colors.textSecondary}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.addonTitle}>IATA Compliant Travel Crate</Text>
                    <Text style={styles.addonSub}>Airline certified, chew-proof with water funnel & absorbent mat</Text>
                  </View>
                  <Text style={styles.addonPrice}>+₹{relocationType === 'international' ? '4,500' : '2,200'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addonItem}
                  onPress={() => setNeedsHealthCert(!needsHealthCert)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={needsHealthCert ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={needsHealthCert ? colors.primary : colors.textSecondary}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.addonTitle}>
                      {relocationType === 'international' ? 'Microchip & Rabies Titer (RNATT)' : 'Fit-To-Fly Vet Health Certificate'}
                    </Text>
                    <Text style={styles.addonSub}>
                      {relocationType === 'international'
                        ? 'ISO 11784 microchip + Govt quarantine clearance'
                        : 'Certified veterinarian clinical checkup & vaccination endorsement'}
                    </Text>
                  </View>
                  <Text style={styles.addonPrice}>+₹{relocationType === 'international' ? '6,500' : '950'}</Text>
                </TouchableOpacity>
              </View>

              {/* Contact Info */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Your Contact Details</Text>
                <TextInput
                  style={[styles.textInput, { marginBottom: 10 }]}
                  value={contactName}
                  onChangeText={setContactName}
                  placeholder="Your Name (e.g. Priya Sharma)"
                  placeholderTextColor={colors.textMuted}
                />
                <TextInput
                  style={styles.textInput}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  keyboardType="phone-pad"
                  placeholder="Mobile Number (e.g. 98450 12345)"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Dynamic Instant Price Box */}
              <View style={styles.priceEstimateCard}>
                <View>
                  <Text style={styles.estimateLabel}>Instant Estimate</Text>
                  <Text style={styles.estimateAmount}>₹{estimatedCost.toLocaleString('en-IN')}</Text>
                  <Text style={styles.estimateSub}>*Inclusive of GST & handling</Text>
                </View>
                <TouchableOpacity style={styles.submitInquiryBtn} onPress={handleInquirySubmit}>
                  <Text style={styles.submitInquiryText}>Request Travel Plan ✈️</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary
  },
  closeBtn: {
    padding: 4
  },
  content: {
    padding: 16,
    gap: 16
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 4,
    gap: 6
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10
  },
  typeTabActive: {
    backgroundColor: '#0284C7'
  },
  typeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  },
  typeTabTextActive: {
    color: '#FFF'
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1'
  },
  highlightText: {
    flex: 1,
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600'
  },
  section: {
    gap: 8
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  inputFlex: {
    flex: 1
  },
  inputSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary
  },
  chipsScroll: {
    marginTop: 6
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10
  },
  modeCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4
  },
  modeCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF7ED'
  },
  modeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  modeTitleActive: {
    color: colors.primary
  },
  modeDesc: {
    fontSize: 10,
    color: colors.textSecondary
  },
  petTypeRow: {
    flexDirection: 'row',
    gap: 8
  },
  petTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  petTypeBtnActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary
  },
  petTypeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  petTypeBtnTextActive: {
    color: colors.primary
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  weightInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: 90
  },
  weightInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  weightUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700'
  },
  addonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  addonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  addonSub: {
    fontSize: 11,
    color: colors.textSecondary
  },
  addonPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },
  priceEstimateCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  estimateLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  estimateAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8'
  },
  estimateSub: {
    fontSize: 10,
    color: '#64748B'
  },
  submitInquiryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12
  },
  submitInquiryText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800'
  },
  successContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 12
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  successDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight
  },
  summaryRoute: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  summaryEstimate: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284C7'
  },
  summaryNote: {
    fontSize: 11,
    color: colors.textSecondary
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
