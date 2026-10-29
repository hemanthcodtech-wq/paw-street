import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import { useVendor } from '../../context/VendorContext';
import { colors } from '../../theme/colors';

export default function VendorDashboardScreen({ navigation }) {
  const { partnerUser, switchRole } = usePartnerAuth();
  const { isStoreOpen, toggleStoreStatus, vendorOrders, products } = useVendor();

  const pendingOrders = vendorOrders.filter(o => o.status !== 'Delivered');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{partnerUser?.storeName || 'Paw Street Central'}</Text>
          <Text style={styles.ownerSubtitle}>Logged in as {partnerUser?.ownerName || 'Vendor'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.statusToggle, isStoreOpen ? styles.statusOpen : styles.statusClosed]}
          onPress={toggleStoreStatus}
        >
          <View style={[styles.statusDot, isStoreOpen ? styles.dotOpen : styles.dotClosed]} />
          <Text style={styles.statusToggleText}>{isStoreOpen ? 'STORE OPEN' : 'STORE CLOSED'}</Text>
        </TouchableOpacity>
      </View>


      {/* Quick Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="cash-outline" size={24} color={colors.accent} />
          <Text style={styles.metricVal}>₹12,450</Text>
          <Text style={styles.metricLabel}>Today's Sales</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="time-outline" size={24} color={colors.vendor} />
          <Text style={styles.metricVal}>{pendingOrders.length}</Text>
          <Text style={styles.metricLabel}>Pending Fulfillment</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="cube-outline" size={24} color={colors.delivery} />
          <Text style={styles.metricVal}>{products.length}</Text>
          <Text style={styles.metricLabel}>Catalog SKUs</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="star" size={24} color="#F59E0B" />
          <Text style={styles.metricVal}>4.9 ★</Text>
          <Text style={styles.metricLabel}>Store Rating</Text>
        </View>
      </View>

      {/* Live Orders Alerts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Incoming Orders ({pendingOrders.length})</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrdersTab')}>
          <Text style={styles.seeAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {pendingOrders.map(ord => (
        <View key={ord.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{ord.id}</Text>
              <Text style={styles.orderCustomer}>{ord.customerName} • {ord.orderTime}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{ord.status}</Text>
            </View>
          </View>

          <View style={styles.orderItemsBox}>
            {ord.items.map((it, idx) => (
              <Text key={idx} style={styles.orderItemLine}>
                • {it.quantity}x {it.name}
              </Text>
            ))}
          </View>

          <View style={styles.orderBottom}>
            <Text style={styles.orderTotal}>₹{ord.total} ({ord.paymentMethod})</Text>
            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => navigation.navigate('OrdersTab')}
            >
              <Text style={styles.manageBtnText}>Manage Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Low Stock Warning */}
      <View style={styles.stockAlertCard}>
        <Ionicons name="alert-circle" size={24} color={colors.accent} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.stockAlertTitle}>Inventory Health Alert</Text>
          <Text style={styles.stockAlertSubtitle}>
            1 item is currently marked out of stock. Tap Products to update quantity.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  ownerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  statusOpen: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22C55E',
  },
  statusClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOpen: {
    backgroundColor: '#22C55E',
  },
  dotClosed: {
    backgroundColor: '#EF4444',
  },
  statusToggleText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  switchRoleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.delivery,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  orderCustomer: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.vendor,
  },
  orderItemsBox: {
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    gap: 4,
  },
  orderItemLine: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  manageBtn: {
    backgroundColor: colors.vendor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  manageBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
  },
  stockAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    marginTop: 10,
  },
  stockAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accent,
  },
  stockAlertSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

