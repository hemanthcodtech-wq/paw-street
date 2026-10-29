import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { colors } from '../theme/colors';

export default function CheckoutScreen({ navigation }) {
  const { cartItems, total, deliveryFee, clearCart } = useCart();
  const { selectedLocation, user } = useAuth();
  const { placeOrder } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState('online'); // online | cod
  const [addressLine, setAddressLine] = useState('Flat 402, Green Valley Apts, Road 12');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const order = placeOrder({
        total,
        deliveryFee,
        items: cartItems,
        deliveryAddress: `${addressLine}, ${selectedLocation.area}, ${selectedLocation.city}`,
        paymentMethod: paymentMethod === 'online' ? 'Prepaid (Razorpay / UPI)' : 'Cash on Delivery (COD)'
      });
      clearCart();
      setLoading(false);
      navigation.replace('OrderSuccess', { order });
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Delivery Address Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color={colors.primaryDark} />
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.cityText}>{selectedLocation.city} ({selectedLocation.pincode})</Text>
          <TextInput
            style={styles.addressInput}
            value={addressLine}
            onChangeText={setAddressLine}
            placeholder="Flat, House No, Street name"
          />
          <Text style={styles.areaNote}>Delivering to: {selectedLocation.area}</Text>
        </View>

        {/* Delivery Slot */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash" size={20} color="#EAB308" />
            <Text style={styles.cardTitle}>Delivery Speed</Text>
          </View>
          <View style={styles.speedOptionActive}>
            <View>
              <Text style={styles.speedTitle}>⚡ 15-Minute Priority Flash</Text>
              <Text style={styles.speedSubtitle}>Delivered straight from nearest verified store</Text>
            </View>
            <Text style={styles.freeText}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={20} color={colors.secondary} />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <TouchableOpacity
            style={[styles.payOption, paymentMethod === 'online' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('online')}
          >
            <Ionicons name="qr-code" size={20} color={colors.primaryDark} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.payOptionTitle}>UPI, Cards & NetBanking (Razorpay)</Text>
              <Text style={styles.payOptionSubtitle}>Instant 100% secure payment</Text>
            </View>
            {paymentMethod === 'online' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primaryDark} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payOption, paymentMethod === 'cod' && styles.payOptionActive]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons name="cash" size={20} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.payOptionTitle}>Cash on Delivery (COD)</Text>
              <Text style={styles.payOptionSubtitle}>Pay cash or scan QR upon rider arrival</Text>
            </View>
            {paymentMethod === 'cod' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primaryDark} />
            )}
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary ({cartItems.length} items)</Text>
          {cartItems.map((item, idx) => (
            <View key={idx} style={styles.summaryRow}>
              <Text style={styles.summaryItemText} numberOfLines={1}>{item.quantity}x {item.name}</Text>
              <Text style={styles.summaryItemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Final Amount</Text>
            <Text style={styles.summaryTotalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.amountLabel}>Total Payable</Text>
          <Text style={styles.amountValue}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderBtnText}>
            {loading ? 'Processing...' : 'Place Order Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  addressInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
  },
  areaNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
  speedOptionActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  speedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  speedSubtitle: {
    fontSize: 11,
    color: '#B45309',
  },
  freeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  payOptionActive: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFF8E7',
  },
  payOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  payOptionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryItemText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    paddingRight: 10,
  },
  summaryItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  amountLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  placeOrderBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  placeOrderBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

