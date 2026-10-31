import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import {
  HYDERABAD_HUBS,
  geocodeAddress,
  reverseGeocodeCoords,
  GOOGLE_GEOCODING_API_KEY
} from '../services/geocoding';

export default function LocationPinModal({ visible, onClose }) {
  const { selectedLocation, updateLocation } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentDraft, setCurrentDraft] = useState(selectedLocation);

  const handleUseGPS = async () => {
    setDetecting(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = Number(pos.coords.latitude.toFixed(6));
            const lng = Number(pos.coords.longitude.toFixed(6));
            const geo = await reverseGeocodeCoords(lat, lng);
            const newLoc = {
              label: 'Current Location',
              area: geo.area || 'Current Location',
              city: geo.city || 'Hyderabad',
              pincode: geo.pincode || '500034',
              lat,
              lng,
              formattedAddress: geo.formattedAddress
            };
            setCurrentDraft(newLoc);
            updateLocation(newLoc);
            setDetecting(false);
            if (onClose) onClose();
          },
          async () => {
            // Default to central Banjara Hills hub
            const hub = HYDERABAD_HUBS[0];
            const fallbackLoc = {
              label: 'Current Location',
              area: `${hub.area}, Road No 12`,
              city: hub.city,
              pincode: hub.pincode,
              lat: hub.lat,
              lng: hub.lng
            };
            setCurrentDraft(fallbackLoc);
            updateLocation(fallbackLoc);
            setDetecting(false);
            if (onClose) onClose();
          },
          { enableHighAccuracy: true, timeout: 6000 }
        );
      } else {
        const hub = HYDERABAD_HUBS[0];
        const fallbackLoc = {
          label: 'Current Location',
          area: `${hub.area}, Road No 12`,
          city: hub.city,
          pincode: hub.pincode,
          lat: hub.lat,
          lng: hub.lng
        };
        setCurrentDraft(fallbackLoc);
        updateLocation(fallbackLoc);
        setDetecting(false);
        if (onClose) onClose();
      }
    } catch (err) {
      setDetecting(false);
      Alert.alert('GPS Notice', 'Unable to detect device GPS. Please pick a locality below.');
    }
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const geo = await geocodeAddress(searchQuery.trim());
      if (geo) {
        const newLoc = {
          label: 'Pinned Area',
          area: geo.area || searchQuery.trim(),
          city: geo.city || 'Hyderabad',
          pincode: geo.pincode || '500034',
          lat: geo.lat,
          lng: geo.lng,
          formattedAddress: geo.formattedAddress
        };
        setCurrentDraft(newLoc);
      } else {
        Alert.alert('Area Not Found', 'Could not locate that address. Please select a popular hub below.');
      }
    } catch (e) {
      Alert.alert('Search Error', e.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectHub = (hub) => {
    const newLoc = {
      label: 'Delivery Hub',
      area: hub.area,
      city: hub.city,
      pincode: hub.pincode,
      lat: hub.lat,
      lng: hub.lng
    };
    setCurrentDraft(newLoc);
  };

  const handleConfirm = () => {
    updateLocation(currentDraft);
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.pinIconCircle}>
                <Ionicons name="location" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.modalHeading}>Pin Delivery Location</Text>
                <Text style={styles.modalSubheading}>
                  Track & explore nearby stores within 15-minute delivery
                </Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* GPS 1-Tap Auto Detect */}
            <TouchableOpacity
              style={styles.gpsButton}
              onPress={handleUseGPS}
              disabled={detecting}
              activeOpacity={0.85}
            >
              {detecting ? (
                <ActivityIndicator color="#0F172A" size="small" />
              ) : (
                <Ionicons name="navigate" size={18} color="#0F172A" />
              )}
              <View style={styles.gpsTextWrap}>
                <Text style={styles.gpsButtonTitle}>
                  {detecting ? 'Detecting Your GPS Location...' : 'Use Current Device Location'}
                </Text>
                <Text style={styles.gpsButtonSub}>Fastest • Auto-detects street & 15-min stores</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SEARCH & SELECT AREA</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Search Input with Geocoding */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search area, landmark or street in Hyderabad..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchLocation}
                returnKeyType="search"
              />
              {searching ? (
                <ActivityIndicator size="small" color="#FFB703" />
              ) : (
                <TouchableOpacity onPress={handleSearchLocation}>
                  <Text style={styles.searchBtnText}>Locate</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Popular Hubs / Localities */}
            <Text style={styles.sectionLabel}>Popular Delivery Areas in Hyderabad</Text>
            <View style={styles.hubsGrid}>
              {HYDERABAD_HUBS.map((hub) => {
                const isSelected =
                  currentDraft?.area === hub.area ||
                  (currentDraft?.lat === hub.lat && currentDraft?.lng === hub.lng);
                return (
                  <TouchableOpacity
                    key={hub.area}
                    style={[styles.hubChip, isSelected && styles.hubChipSelected]}
                    onPress={() => handleSelectHub(hub)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'location-outline'}
                      size={14}
                      color={isSelected ? '#0F172A' : '#64748B'}
                    />
                    <Text
                      style={[styles.hubChipText, isSelected && styles.hubChipTextSelected]}
                    >
                      {hub.area}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Currently Pinned Location Card */}
            <View style={styles.currentPinCard}>
              <View style={styles.pinCardHeader}>
                <Ionicons name="pin" size={16} color="#FB8500" />
                <Text style={styles.pinCardLabel}>SELECTED LOCATION PIN</Text>
              </View>
              <Text style={styles.pinCardArea}>
                {currentDraft?.area || 'Banjara Hills, Road No 12'}
              </Text>
              <Text style={styles.pinCardCity}>
                {currentDraft?.city || 'Hyderabad'} - {currentDraft?.pincode || '500034'}
              </Text>
              <Text style={styles.pinCardCoords}>
                📍 Lat: {currentDraft?.lat || 17.4156} | Lng: {currentDraft?.lng || 78.4350}
              </Text>
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmBtnText}>Confirm Location & Explore Nearby Stores</Text>
            <Ionicons name="arrow-forward" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
  },
  headerRow: {
    marginBottom: 16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pinIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFB703',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    maxHeight: 420,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB703',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#FFB703',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  gpsTextWrap: {
    flex: 1,
  },
  gpsButtonTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  gpsButtonSub: {
    fontSize: 11,
    color: '#334155',
    marginTop: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  searchBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    paddingHorizontal: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hubsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  hubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  hubChipSelected: {
    backgroundColor: '#FFB703',
    borderColor: '#F59E0B',
  },
  hubChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  hubChipTextSelected: {
    fontWeight: '800',
    color: '#0F172A',
  },
  currentPinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  pinCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pinCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  pinCardArea: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  pinCardCity: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  pinCardCoords: {
    fontSize: 11,
    color: '#059669',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    marginTop: 4,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB703',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
    shadowColor: '#FFB703',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
});
