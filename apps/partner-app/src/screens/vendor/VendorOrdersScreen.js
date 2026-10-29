import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVendor } from '../../context/VendorContext';
import { colors } from '../../theme/colors';

export default function VendorOrdersScreen() {
  const { vendorOrders, updateOrderStatus } = useVendor();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterTabs = ['All', 'Preparing', 'Ready for Pickup', 'Delivered'];

  const filteredOrders = vendorOrders.filter(ord => {
    if (selectedFilter === 'All') return true;
    return ord.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    Alert.alert('Status Updated', `Order ${orderId} is now marked as "${newStatus}"`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Fulfillment</Text>
        <Text style={styles.headerSubtitle}>Real-time store orders queue</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterTabs}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tabBtn, selectedFilter === item && styles.tabBtnActive]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text style={[styles.tabText, selectedFilter === item && styles.tabTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={styles.orderTime}>{item.orderTime}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                item.status === 'Ready for Pickup' ? styles.badgeReady :
                item.status === 'Preparing' ? styles.badgePreparing : styles.badgeDelivered
              ]}>
                <Text style={styles.statusBadgeText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.customerBox}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.customerText}>{item.customerName} ({item.customerPhone})</Text>
            </View>
            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.addressText}>{item.deliveryAddress}</Text>
            </View>

            {/* Items */}
            <View style={styles.itemsWrapper}>
              {item.items.map((it, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>• {it.quantity}x {it.name}</Text>
                  <Text style={styles.itemPrice}>₹{it.price}</Text>
                </View>
              ))}
            </View>

            <View style={styles.orderSummaryRow}>
              <Text style={styles.totalText}>Total: ₹{item.total} ({item.paymentMethod})</Text>
              <Text style={styles.assignedRider}>Rider: {item.deliveryPartnerAssigned}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              {item.status === 'Preparing' && (
                <TouchableOpacity
                  style={styles.actionBtnReady}
                  onPress={() => handleStatusChange(item.id, 'Ready for Pickup')}
                >
                  <Ionicons name="checkmark-done" size={16} color={colors.white} />
                  <Text style={styles.actionBtnText}>Mark Ready for Pickup</Text>
                </TouchableOpacity>
              )}

              {item.status === 'Ready for Pickup' && (
                <TouchableOpacity
                  style={styles.actionBtnDispatch}
                  onPress={() => handleStatusChange(item.id, 'Delivered')}
                >
                  <Ionicons name="paper-plane" size={16} color={colors.white} />
                  <Text style={styles.actionBtnText}>Handover to Rider</Text>
                </TouchableOpacity>
              )}

              {item.status === 'Delivered' && (
                <View style={styles.deliveredFlag}>
                  <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                  <Text style={styles.deliveredFlagText}>Order Completed</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterTabsRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tabBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  tabBtnActive: {
    backgroundColor: colors.vendor,
    borderColor: colors.vendor,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  orderTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeReady: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  badgePreparing: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  badgeDelivered: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  customerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  customerText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  addressText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  itemsWrapper: {
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderSummaryRow: {
    marginBottom: 10,
  },
  totalText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  assignedRider: {
    fontSize: 11,
    color: colors.delivery,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  actionBtnReady: {
    flex: 1,
    backgroundColor: colors.vendor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnDispatch: {
    flex: 1,
    backgroundColor: colors.delivery,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  deliveredFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveredFlagText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
  },
});

