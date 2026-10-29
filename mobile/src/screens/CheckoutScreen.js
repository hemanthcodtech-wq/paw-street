import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import LocationModal from '../components/LocationModal';

const PAYMENT_METHODS = [
  { id: 'cod', title: 'Cash on Delivery (COD)', desc: 'Pay via cash or UPI to rider at doorstep', icon: 'cash-outline', popular: true },
  { id: 'upi', title: 'Instant UPI (GPay / PhonePe / Paytm)', desc: 'Fast, secure, 1-click UPI checkout', icon: 'flash-outline' },
  { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex', icon: 'card-outline' },
  { id: 'netbanking', title: 'Net Banking', desc: 'All Indian banks supported', icon: 'business-outline' }
];

export default function CheckoutScreen({ navigation }) {
  const { items, grandTotal, clearCart } = useCart();
  const { selectedLocation } = useAuth();
  const { placeOrder } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [instructions, setInstructions] = useState('Pet is friendly, please call before arriving');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const order = await placeOrder({
        items,
        totalAmount: grandTotal,
        deliveryAddress: selectedLocation?.area || 'Banjara Hills, Hyderabad',
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (UPI/Card)'
      });
      clearCart();
      navigation.replace('OrderSuccess', { orderId: order.id });
    } catch (e) {
      console.warn('Error placing order:', e);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 1. Address Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="location" size={18} color="#EA580C" />
              <Text style={styles.cardTitle}>DELIVERING TO</Text>
            </View>
            <TouchableOpacity onPress={() => setIsLocationModalVisible(true)}>
              <Text style={styles.editBtn}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.addressLabel}>{selectedLocation?.label || 'Home'}</Text>
          <Text style={styles.addressText}>
            {selectedLocation?.area || 'Flat 402, Royal Palms Residency, Road No 12, Banjara Hills, Hyderabad - 500034'}
          </Text>

          <View style={styles.deliveryBadge}>
            <Ionicons name="bicycle" size={14} color="#059669" />
            <Text style={styles.deliveryBadgeText}>⚡ 15-Minute Guaranteed Delivery</Text>
          </View>
        </View>

        {/* 2. Delivery Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DELIVERY INSTRUCTIONS</Text>
          <TextInput
            style={styles.instructionInput}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="e.g. Leave at door, Beware of dog, Ring bell"
            placeholderTextColor={colors.textMuted}
          />
          <View style={styles.quickTags}>
            {['Beware of Dog 🐕', 'Leave at Door', 'Call on Arrival'].map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tagChip}
                onPress={() => setInstructions(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SELECT PAYMENT METHOD</Text>

          {PAYMENT_METHODS.map((pm) => {
            const isSelected = paymentMethod === pm.id;
            return (
              <TouchableOpacity
                key={pm.id}
                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                onPress={() => setPaymentMethod(pm.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.pmIcon, isSelected && styles.pmIconSelected]}>
                  <Ionicons
                    name={pm.icon}
                    size={20}
                    color={isSelected ? colors.primaryDark : colors.textSecondary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.pmTitle}>{pm.title}</Text>
                    {pm.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.pmDesc}>{pm.desc}</Text>
                </View>

                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? colors.primaryDark : colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Order Summary Snapshot */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ORDER SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryVal}>{items.length} items</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryTotalVal}>₹{grandTotal}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Place Order Button */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotal}>₹{grandTotal}</Text>
          <Text style={styles.bottomPaymentMethod}>
            {paymentMethod === 'cod' ? 'Pay on Delivery' : 'Online Payment'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, isPlacing && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacing}
          activeOpacity={0.8}
        >
          {isPlacing ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  editBtn: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    marginTop: 10,
    gap: 6,
    alignSelf: 'flex-start',
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  instructionInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 8,
  },
  quickTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    marginTop: 8,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  paymentOptionSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  pmIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pmIconSelected: {
    backgroundColor: '#FEF3C7',
  },
  pmTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  popularBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#15803D',
  },
  pmDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.secondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomTotal: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  bottomPaymentMethod: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
