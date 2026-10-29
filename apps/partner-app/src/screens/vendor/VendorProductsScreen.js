import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVendor } from '../../context/VendorContext';
import { colors } from '../../theme/colors';

export default function VendorProductsScreen() {
  const { products, toggleStock, addProduct } = useVendor();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dog Food');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('25');

  const handleCreateProduct = () => {
    if (!name || !price) {
      Alert.alert('Required', 'Please enter product name and selling price');
      return;
    }
    addProduct({
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 20,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'
    });
    setName('');
    setPrice('');
    setModalVisible(false);
    Alert.alert('Success', 'Product added to your store catalog!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventory & Catalog</Text>
          <Text style={styles.headerSubtitle}>{products.length} SKUs in your store</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={18} color={colors.white} />
          <Text style={styles.addBtnText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImg} />
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <Text style={styles.stockCount}>Current Stock: {item.stock} units</Text>
            </View>

            <View style={styles.stockToggleGroup}>
              <Text style={[styles.stockStatusLabel, item.inStock ? styles.textGreen : styles.textRed]}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
              <Switch
                value={item.inStock}
                onValueChange={() => toggleStock(item.id)}
                trackColor={{ false: '#EF4444', true: '#22C55E' }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        )}
      />

      {/* Add Product Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Pet Product 📦</Text>

            <Text style={styles.inputLabel}>Product Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grain Free Salmon Dog Kibble"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dog Food / Cat Food / Toys"
              placeholderTextColor={colors.textMuted}
              value={category}
              onChangeText={setCategory}
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Selling Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1299"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>Initial Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 25"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleCreateProduct}
              >
                <Text style={styles.saveText}>Save Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: colors.vendor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  productImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productCategory: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.accent,
  },
  stockCount: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  stockToggleGroup: {
    alignItems: 'center',
    gap: 4,
  },
  stockStatusLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  textGreen: {
    color: '#22C55E',
  },
  textRed: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  formRow: {
    flexDirection: 'row',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: colors.vendor,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
});

