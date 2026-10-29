import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import StoreCard from '../components/StoreCard';
import { api } from '../services/api';

export default function StoresScreen({ navigation }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
    } catch (e) {
      console.warn('Error loading stores:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = stores.filter(s =>
    !search.trim() ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores in Hyderabad..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.headlineBox}>
          <Text style={styles.headlineTitle}>Verified Partner Pet Stores</Text>
          <Text style={styles.headlineSub}>
            Licensed local pet pharmacies, food hubs, and luxury salons
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primaryDark} />
          </View>
        ) : (
          filtered.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onPress={() => {
                navigation.navigate('CatalogTab', {
                  screen: 'CatalogList',
                  params: { search: store.name }
                });
              }}
            />
          ))
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  list: {
    padding: spacing.lg,
  },
  headlineBox: {
    marginBottom: spacing.lg,
  },
  headlineTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headlineSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  centerBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
