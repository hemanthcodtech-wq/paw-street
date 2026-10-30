import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeScreen backgroundColor={colors.background}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <Ionicons name="bag-handle-outline" size={48} color={colors.primaryDark} />
          </View>
          <Text style={styles.emptyTitle}>Your Pet Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Give your pet the treats, food, and toys they love!</Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('CatalogTab')}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen backgroundColor={colors.background}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart ({cartItems.length})</Text>
        <View style={styles.deliveryBadge}>
          <Ionicons name="flash" size={12} color="#FFF" />
          <Text style={styles.deliveryBadgeText}>15-20 MINS</Text>
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <>
            {/* Coupon Code Section */}
            <View style={styles.couponCard}>
              <View style={styles.couponInputRow}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primaryDark} />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter Coupon (e.g. PAWFIRST)"
                  placeholderTextColor={colors.textMuted}
                  value={couponInput}
                  onChangeText={(val) => {
                    setCouponInput(val);
                    setCouponError('');
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCoupon}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {appliedCoupon && (
                <View style={styles.appliedBanner}>
                  <Text style={styles.appliedText}>✅ Code {appliedCoupon.code} applied (-₹{discountAmount})</Text>
                  <TouchableOpacity onPress={removeCoupon}>
                    <Text style={styles.removeCouponText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              {couponError ? <Text style={styles.errorText}>{couponError}</Text> : null}
            </View>

            {/* Bill Details */}
            <View style={styles.billCard}>
              <Text style={styles.billTitle}>Bill Details</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Total</Text>
                <Text style={styles.billValue}>₹{subtotal}</Text>
              </View>
              {discountAmount > 0 && (
                <View style={styles.billRow}>
                  <Text style={styles.billLabelGreen}>Discount Savings</Text>
                  <Text style={styles.billValueGreen}>-₹{discountAmount}</Text>
                </View>
              )}
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Instant Delivery Partner Fee</Text>
                <Text style={styles.billValue}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.billRowTotal}>
                <Text style={styles.totalLabel}>To Pay</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemWeight}>{item.weight || 'Pack'}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>

            <View style={styles.qtyBox}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Ionicons name="remove" size={14} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Ionicons name="add" size={14} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Checkout CTA */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotalLabel}>Grand Total</Text>
          <Text style={styles.checkoutTotal}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  deliveryBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  deliveryBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemWeight: {
    fontSize: 11,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  couponCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  applyBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  appliedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#DCFCE7',
    padding: 6,
    borderRadius: 6,
  },
  appliedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  removeCouponText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    marginTop: 6,
  },
  billCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  billLabelGreen: {
    fontSize: 12,
    color: '#15803D',
  },
  billValueGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  checkoutTotalLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  checkoutTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopNowBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

