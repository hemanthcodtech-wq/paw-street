import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function DeliveryHistoryScreen() {
  const completedTrips = [
    {
      id: 'TRIP-702',
      store: 'Paw Street Central Store',
      customer: 'Aarav Sharma',
      time: 'Today, 2:35 PM',
      fee: '₹85',
      tip: '₹20',
      distance: '1.4 km',
      rating: 5
    },
    {
      id: 'TRIP-701',
      store: 'City Vet Pharmacy',
      customer: 'Pooja Reddy',
      time: 'Today, 1:15 PM',
      fee: '₹95',
      tip: '₹0',
      distance: '2.8 km',
      rating: 5
    },
    {
      id: 'TRIP-700',
      store: 'Paws & Whiskers Spa',
      customer: 'Vikram Joshi',
      time: 'Today, 11:45 AM',
      fee: '₹60',
      tip: '₹30',
      distance: '1.1 km',
      rating: 5
    },
    {
      id: 'TRIP-699',
      store: 'Paw Street Central Store',
      customer: 'Sneha Patel',
      time: 'Yesterday, 8:20 PM',
      fee: '₹110',
      tip: '₹40',
      distance: '3.6 km',
      rating: 4.8
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip History</Text>
        <Text style={styles.headerSubtitle}>Past completed deliveries & customer tips</Text>
      </View>

      <FlatList
        data={completedTrips}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.tripId}>{item.id}</Text>
                <Text style={styles.tripTime}>{item.time} • {item.distance}</Text>
              </View>
              <View style={styles.earningsTag}>
                <Text style={styles.earningsVal}>{item.fee}</Text>
                {item.tip !== '₹0' && (
                  <Text style={styles.tipText}>+{item.tip} tip</Text>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="storefront" size={14} color={colors.vendor} />
              <Text style={styles.detailText}>{item.store}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={14} color={colors.delivery} />
              <Text style={styles.detailText}>{item.customer}</Text>
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating} Star Customer Rating</Text>
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
    paddingBottom: 10,
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tripId: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  tripTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  earningsTag: {
    alignItems: 'flex-end',
  },
  earningsVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#22C55E',
  },
  tipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  detailText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  ratingText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
  },
});

