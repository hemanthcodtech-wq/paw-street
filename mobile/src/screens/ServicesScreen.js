import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import { api } from '../services/api';

const TABS = [
  { id: 'all', label: 'All Services', icon: '✨' },
  { id: 'grooming', label: 'Pet Grooming', icon: '✂️' },
  { id: 'clinic', label: 'Vet Clinic', icon: '🏥' },
  { id: 'boarding', label: 'Pet Boarding', icon: '🏡' }
];

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (e) {
      console.warn('Error loading services:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = services.filter((s) => activeTab === 'all' || s.category === activeTab);

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.tabsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabChip, isSelected && styles.tabChipSelected]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 13, marginRight: 4 }}>{tab.icon}</Text>
                <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Vet Banner */}
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyIcon}>
            <Ionicons name="call" size={20} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>24/7 Pet Emergency Helpline</Text>
            <Text style={styles.emergencySub}>Immediate ambulance & on-call veterinarian</Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Services List */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primaryDark} />
          </View>
        ) : (
          filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onBook={(serv) => setSelectedService(serv)}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Booking Appointment Modal */}
      <BookingModal
        visible={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsBar: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabsScroll: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabChipSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextSelected: {
    color: '#92400E',
  },
  content: {
    padding: spacing.lg,
  },
  emergencyBanner: {
    backgroundColor: '#E11D48',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: 10,
  },
  emergencyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emergencySub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 1,
  },
  callBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  callBtnText: {
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '800',
  },
  centerBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
