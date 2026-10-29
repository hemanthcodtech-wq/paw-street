import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header Buttons */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.navigate('CartTab')}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.productImage} />

        <View style={styles.detailsCard}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.ratingVal}>{product.rating || 4.8}</Text>
            </View>
            <Text style={styles.reviewsText}>({product.reviewsCount || 150} reviews)</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>IN STOCK</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.oldPrice}>₹{product.originalPrice}</Text>
            )}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Delivery & Store Info */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="bicycle" size={18} color={colors.accent} />
              <Text style={styles.infoText}>Instant Delivery: {product.deliveryTime || 'In 15-20 Mins'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="storefront" size={18} color={colors.primaryDark} />
              <Text style={styles.infoText}>Sold by: {product.storeName || 'Paw Street Verified Store'}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeading}>About this item</Text>
          <Text style={styles.description}>
            {product.description || 'Specially formulated with natural premium ingredients to keep your pet energetic, healthy, and happy throughout every stage of life.'}
          </Text>

          {/* Nutrition / Highlights */}
          {product.nutrition && (
            <>
              <Text style={styles.sectionHeading}>Key Ingredients & Nutrition</Text>
              <View style={styles.nutritionBox}>
                {product.nutrition.map((item, index) => (
                  <View key={index} style={styles.nutritionItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
                    <Text style={styles.nutritionText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.qtySelector}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQty(Math.max(1, qty - 1))}
          >
            <Ionicons name="remove" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQty(qty + 1)}
          >
            <Ionicons name="add" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            addToCart(product, qty);
          }}
        >
          <Ionicons name="bag-add" size={18} color="#FFF" />
          <Text style={styles.addToCartText}>Add to Cart • ₹{product.price * qty}</Text>
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    padding: 20,
  },
  brand: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    lineHeight: 26,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stockBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  oldPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  infoBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  nutritionBox: {
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nutritionText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
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
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

