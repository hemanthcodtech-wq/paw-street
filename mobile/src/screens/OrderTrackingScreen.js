import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useOrders } from '../context/OrderContext';

export default function OrderTrackingScreen({ navigation, route }) {
  const { activeOrder, orders } = useOrders();
  const orderId = route.params?.orderId;
  const currentOrder = orders.find(o => o.id === orderId) || activeOrder || orders[0];

  const rider = currentOrder?.rider || {
    name: 'Ramesh Kumar',
    vehicle: 'Hero Splendor (TS 09 EA 4120)',
    phone: '+91 91234 56789',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  };

  const timeline = currentOrder?.timeline || [
    { step: 'Order Placed', time: '02:00 PM', done: true },
    { step: 'Store Packed', time: '02:08 PM', done: true },
    { step: 'Rider Picked Up', time: '02:14 PM', done: true },
    { step: 'Out for Delivery', time: '02:16 PM', done: true, current: true },
    { step: 'Delivered', time: 'Est. 02:28 PM', done: false }
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status Header */}
        <View style={styles.statusCard}>
          <View style={styles.etaRow}>
            <View>
              <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
              <Text style={styles.etaTime}>{currentOrder?.eta || '12-15 Mins'}</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusPillText}>ON TIME</Text>
            </View>
          </View>
          <Text style={styles.statusSub}>
            {currentOrder?.statusText || 'Rider is on the way with your pet essentials!'}
          </Text>
        </View>

        {/* Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>LIVE DELIVERY PROGRESS</Text>
          <View style={styles.timelineList}>
            {timeline.map((step, idx) => {
              const isLast = idx === timeline.length - 1;
              return (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineIconCol}>
                    <View
                      style={[
                        styles.dot,
                        step.done && styles.dotDone,
                        step.current && styles.dotCurrent
                      ]}
                    >
                      {step.done ? (
                        <Ionicons name="checkmark" size={12} color="#FFF" />
                      ) : (
                        <View style={styles.dotInner} />
                      )}
                    </View>
                    {!isLast && (
                      <View style={[styles.timelineLine, step.done && styles.lineDone]} />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        step.current && styles.stepTitleCurrent,
                        !step.done && !step.current && styles.stepTitlePending
                      ]}
                    >
                      {step.step}
                    </Text>
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Rider Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DELIVERY PARTNER</Text>
          <View style={styles.riderRow}>
            <Image source={{ uri: rider.avatar }} style={styles.riderAvatar} />

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.riderName}>{rider.name}</Text>
                <View style={styles.riderRating}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={styles.riderRatingText}>{rider.rating}</Text>
                </View>
              </View>
              <Text style={styles.riderVehicle}>{rider.vehicle}</Text>
            </View>

            <TouchableOpacity
              style={styles.callRiderBtn}
              onPress={() => Linking.openURL(`tel:${rider.phone}`)}
            >
              <Ionicons name="call" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DELIVERING TO</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="location-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.addressText} numberOfLines={2}>
              {currentOrder?.deliveryAddress || 'Banjara Hills, Hyderabad'}
            </Text>
          </View>
        </View>

        {/* Items in Order */}
        {currentOrder?.items && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ITEMS IN THIS ORDER</Text>
            {currentOrder.items.map((item, idx) => (
              <View key={idx} style={styles.orderItemRow}>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={styles.orderTotalRow}>
              <Text style={styles.orderTotalLabel}>Total Paid</Text>
              <Text style={styles.orderTotalVal}>₹{currentOrder.totalAmount}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  statusCard: {
    backgroundColor: '#023047',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  etaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  etaTime: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  statusSub: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
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
  timelineList: {
    paddingVertical: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 46,
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 28,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotDone: {
    backgroundColor: '#10B981',
  },
  dotCurrent: {
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: '#10B981',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepTitleCurrent: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  stepTitlePending: {
    color: colors.textMuted,
  },
  stepTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceAlt,
  },
  riderName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  riderRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
  },
  riderRatingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  riderVehicle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  callRiderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderItemName: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  orderTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primaryDark,
  },
});
