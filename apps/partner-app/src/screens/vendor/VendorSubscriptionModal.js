import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter Seller',
    tagline: 'Ideal for small neighborhood pet shops',
    price: 0,
    interval: 'month',
    commission: '12%',
    maxProducts: '30 Products',
    badge: null,
    features: [
      'Standard search placement',
      'Basic order notifications',
      'Weekly payout settlement',
      'Standard support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Store Plan',
    tagline: 'Most Popular for growing pet stores & groomers',
    price: 1499,
    interval: 'month',
    commission: '7%',
    savings: 'Save 5% on every order',
    maxProducts: '200 Products',
    badge: 'GOLDEN BADGE',
    popular: true,
    features: [
      'Verified Golden Partner Badge ⭐',
      'Priority rank in search results',
      'Fast 24-hr payout settlements',
      'SMS & WhatsApp order alerts',
      'Store analytics dashboard'
    ]
  },
  {
    id: 'elite',
    name: 'Elite Superstore & Breeder',
    tagline: 'For high-volume pet stores, pet clinics & certified breeders',
    price: 2999,
    interval: 'month',
    commission: '3%',
    savings: 'Save 9% on every order (Keep 97%)',
    maxProducts: 'Unlimited Catalog',
    badge: 'ELITE VIP',
    features: [
      'Ultra-low 3% platform commission',
      'Top homepage banner rotation',
      'Unlimited products & puppy litters',
      'Instant same-day payouts',
      'Dedicated Account Manager'
    ]
  }
];

export default function VendorSubscriptionModal({ visible, onClose, activePlan = 'starter', onPlanUpdated }) {
  const insets = useSafeAreaInsets();
  const [currentPlan, setCurrentPlan] = useState(activePlan);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = (plan) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentPlan(plan.id);
      if (onPlanUpdated) onPlanUpdated(plan.id);
      Alert.alert(
        'Store Upgraded! 🎉',
        `Your store is now upgraded to ${plan.name} at ${plan.commission} commission rate with Verified Badge.`
      );
      if (onClose) onClose();
    }, 900);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 16) + 14 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <Ionicons name="ribbon" size={22} color="#FFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Pet Seller Subscription Plans</Text>
                <Text style={styles.headerSub}>Lower Commission • Golden Badge • More Orders</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Current Status Pill */}
            <View style={styles.currentPlanBanner}>
              <Ionicons name="information-circle" size={18} color="#0284C7" />
              <Text style={styles.currentPlanBannerText}>
                Active Tier: <Text style={{ fontWeight: '800' }}>{currentPlan.toUpperCase()}</Text> ({currentPlan === 'starter' ? '12% comm.' : currentPlan === 'pro' ? '7% comm.' : '3% comm.'})
              </Text>
            </View>

            {/* Plans List */}
            {SUBSCRIPTION_PLANS.map(plan => {
              const isActive = currentPlan === plan.id;
              const isSelected = selectedPlan === plan.id;

              return (
                <View
                  key={plan.id}
                  style={[
                    styles.planCard,
                    plan.popular && styles.planCardPopular,
                    isSelected && styles.planCardSelected
                  ]}
                >
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>MOST POPULAR 🔥</Text>
                    </View>
                  )}

                  <View style={styles.planTopRow}>
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planTagline}>{plan.tagline}</Text>
                    </View>
                    {plan.badge && (
                      <View style={styles.goldenBadge}>
                        <Ionicons name="shield-checkmark" size={12} color="#92400E" />
                        <Text style={styles.goldenBadgeText}>{plan.badge}</Text>
                      </View>
                    )}
                  </View>

                  {/* Pricing Box */}
                  <View style={styles.priceRow}>
                    <Text style={styles.planPrice}>
                      {plan.price === 0 ? 'FREE' : `₹${plan.price}`}
                    </Text>
                    {plan.price > 0 && <Text style={styles.planInterval}>/{plan.interval}</Text>}
                    <View style={styles.commissionPill}>
                      <Text style={styles.commissionPillText}>{plan.commission} Commission</Text>
                    </View>
                  </View>

                  {plan.savings && (
                    <Text style={styles.savingsText}>💰 {plan.savings}</Text>
                  )}

                  {/* Feature Checklist */}
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#059669" />
                      <Text style={styles.featureText}>{plan.maxProducts}</Text>
                    </View>
                    {plan.features.map((feat, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#059669" />
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Action Button */}
                  {isActive ? (
                    <View style={styles.activePlanBtn}>
                      <Ionicons name="checkmark-done" size={16} color="#059669" />
                      <Text style={styles.activePlanBtnText}>Currently Active</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.upgradeBtn, plan.popular && styles.upgradeBtnPopular]}
                      onPress={() => handleUpgrade(plan)}
                      disabled={isProcessing}
                    >
                      <Text style={styles.upgradeBtnText}>
                        {isProcessing ? 'Activating...' : `Upgrade to ${plan.name} →`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
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
    borderBottomColor: colors.surfaceBorder
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
    backgroundColor: '#F59E0B',
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
    gap: 14
  },
  currentPlanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  currentPlanBannerText: {
    fontSize: 12,
    color: '#0369A1'
  },
  planCard: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    position: 'relative'
  },
  planCardPopular: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFDF9'
  },
  planCardSelected: {
    borderColor: colors.vendor
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFF'
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  planName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary
  },
  planTagline: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  goldenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  goldenBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 6
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary
  },
  planInterval: {
    fontSize: 12,
    color: colors.textSecondary
  },
  commissionPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 6
  },
  commissionPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 10
  },
  featureList: {
    gap: 6,
    marginVertical: 10
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  featureText: {
    fontSize: 12,
    color: colors.textPrimary
  },
  upgradeBtn: {
    backgroundColor: colors.vendor,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  upgradeBtnPopular: {
    backgroundColor: '#D97706'
  },
  upgradeBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800'
  },
  activePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  activePlanBtnText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '800'
  }
});
