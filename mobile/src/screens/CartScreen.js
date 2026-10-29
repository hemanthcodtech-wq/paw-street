import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LocationModal from '../components/LocationModal';
import { COUPONS } from '../data/mockData';

export default function CartScreen({ navigation }) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalMrp,
    discountMrp,
    deliveryFee,
    couponDiscount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { selectedLocation } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="bag-handle-outline" size={48} color={colors.textSecondary} />
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySub}>
          Looks like you haven't added any pet food or accessories yet.
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('CatalogTab')}
          activeOpacity={0.8}
        >
          <Text style={styles.browseBtnText}>Explore Pet Essentials</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Delivery ETA & Address Header Card */}
        <View style={styles.addressCard}>
          <View style={styles.etaRow}>
            <View style={styles.flashIcon}>
              <Ionicons name="flash" size={16} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.etaHeader}>Delivering in 15-20 Mins</Text>
              <Text style={styles.addressLine} numberOfLines={1}>
                {selectedLocation?.area || selectedLocation?.city || 'Banjara Hills, Hyderabad'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => setIsLocationModalVisible(true)}
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ORDER ITEMS ({items.length})</Text>
          {items.map((item, index) => (
            <View key={`${item.id}-${item.selectedSize}`} style={[styles.itemRow, index > 0 && styles.itemBorder]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemSize}>Size: {item.selectedSize}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                  {item.mrp && (
                    <Text style={styles.itemMrp}>₹{item.mrp * item.quantity}</Text>
                  )}
                </View>
              </View>

              {/* Stepper */}
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(item.id, item.selectedSize, -1)}
                >
                  <Ionicons name={item.quantity === 1 ? 'trash-outline' : 'remove'} size={14} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.stepQty}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(item.id, item.selectedSize, 1)}
                >
                  <Ionicons name="add" size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add more items button */}
          <TouchableOpacity
            style={styles.addMoreRow}
            onPress={() => navigation.navigate('CatalogTab')}
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.addMoreText}>Add more items</Text>
          </TouchableOpacity>
        </View>

        {/* Coupon Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>COUPONS & OFFERS</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCouponCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.appliedCode}>'{appliedCoupon.code}' APPLIED</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                </View>
                <Text style={styles.appliedDesc}>You saved ₹{couponDiscount} with this code!</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code (e.g. PAWFIRST)"
                placeholderTextColor={colors.textMuted}
                value={couponCode}
                onChangeText={setCouponCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  if (couponCode) applyCoupon(couponCode);
                }}
              >
                <Text style={styles.applyBtnText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Coupon Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {COUPONS.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={[styles.couponChip, appliedCoupon?.code === c.code && styles.couponChipActive]}
                onPress={() => applyCoupon(c.code)}
              >
                <Text style={styles.couponChipCode}>{c.code}</Text>
                <Text style={styles.couponChipLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bill Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BILL DETAILS</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total (MRP)</Text>
            <Text style={styles.billVal}>₹{totalMrp}</Text>
          </View>

          {discountMrp > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Store Discount</Text>
              <Text style={[styles.billVal, { color: '#059669' }]}>- ₹{discountMrp}</Text>
            </View>
          )}

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billVal}>₹{subtotal}</Text>
          </View>

          <View style={styles.billRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              {subtotal > 499 && (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>FREE OVER ₹499</Text>
                </View>
              )}
            </View>
            <Text style={styles.billVal}>
              {deliveryFee === 0 ? <Text style={{ color: '#059669' }}>FREE</Text> : `₹${deliveryFee}`}
            </Text>
          </View>

          {couponDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon Discount ({appliedCoupon?.code})</Text>
              <Text style={[styles.billVal, { color: '#059669' }]}>- ₹{couponDiscount}</Text>
            </View>
          )}

          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalVal}>₹{grandTotal}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Checkout Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotal}>₹{grandTotal}</Text>
          <Text style={styles.bottomViewDetails}>TOTAL AMOUNT</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" />
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
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  browseBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  addressCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flashIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  addressLine: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  changeBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: 12,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemSize: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  itemMrp: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQty: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 6,
  },
  addMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 6,
  },
  addMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  appliedCouponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  appliedCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  appliedDesc: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  removeCouponText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  couponChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: colors.surfaceAlt,
  },
  couponChipActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  couponChipCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  couponChipLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  billVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  freeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  freeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#059669',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
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
  bottomViewDetails: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    gap: 6,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
