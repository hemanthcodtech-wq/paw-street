import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandLogo from '../../components/BrandLogo';
import { colors } from '../../theme/colors';

export default function PartnerWelcomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Decorative Glow */}
      <View style={styles.glowTop} />

      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <BrandLogo size="large" subtitle="Partner Portal" dark={false} />
      </View>

      <Text style={styles.mainTitle}>Welcome, Business Partner</Text>
      <Text style={styles.subTitle}>Select your role to access your dedicated portal</Text>

      {/* Dedicated Role Selection Cards */}
      <View style={styles.buttonsContainer}>
        {/* 1. Login as Vendor Button */}
        <TouchableOpacity
          style={styles.vendorCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('VendorAuth')}
        >
          <View style={styles.cardIconBoxVendor}>
            <Ionicons name="storefront" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Login as Vendor</Text>
            <Text style={styles.cardDesc}>Store management, live inventory & orders fulfillment</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FB8500" />
        </TouchableOpacity>

        {/* 2. Login as Delivery Partner Button */}
        <TouchableOpacity
          style={styles.deliveryCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliveryAuth')}
        >
          <View style={styles.cardIconBoxDelivery}>
            <Ionicons name="bicycle" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Login as Delivery Partner</Text>
            <Text style={styles.cardDesc}>Duty toggle, order pool pickup & rider earnings wallet</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#059669" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerNote}>
        <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
        <Text style={styles.footerText}>Secure 256-bit encrypted partner access</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAF7F2',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 183, 3, 0.14)',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 28,
  },
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    shadowColor: '#FB8500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIconBoxVendor: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FB8500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIconBoxDelivery: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});

