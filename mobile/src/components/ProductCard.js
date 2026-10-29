import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onPress, horizontal = false }) {
  const { addToCart, items, updateQuantity, toggleWishlist, isWishlisted } = useCart();

  const cartItem = items.find(
    i => i.id === product.id && i.selectedSize === ((product.sizes && product.sizes[0]?.size) || 'Standard')
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e) => {
    e?.stopPropagation?.();
    addToCart(product);
  };

  const handleIncrement = (e) => {
    e?.stopPropagation?.();
    const size = (product.sizes && product.sizes[0]?.size) || 'Standard';
    updateQuantity(product.id, size, 1);
  };

  const handleDecrement = (e) => {
    e?.stopPropagation?.();
    const size = (product.sizes && product.sizes[0]?.size) || 'Standard';
    updateQuantity(product.id, size, -1);
  };

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardGrid]}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.88}
    >
      {/* Product Image Area */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Discount Badge */}
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={wishlisted ? '#EF4444' : '#64748B'}
          />
        </TouchableOpacity>

        {/* Delivery ETA badge */}
        <View style={styles.etaBadge}>
          <Ionicons name="time-outline" size={11} color="#059669" />
          <Text style={styles.etaText}>{product.eta || '15 min'}</Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.storeText} numberOfLines={1}>
          {product.storeName || 'Paw Street Direct'}
        </Text>

        <Text style={styles.titleText} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={styles.ratingText}>{product.rating || 4.8}</Text>
          </View>
          <Text style={styles.reviewsText}>({product.reviewsCount || 120})</Text>
        </View>

        {/* Pricing & Add to Cart Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{product.price}</Text>
            {product.mrp && product.mrp > product.price && (
              <Text style={styles.mrpText}>₹{product.mrp}</Text>
            )}
          </View>

          {/* Add to Cart or Stepper */}
          {inCartQty === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>ADD</Text>
              <Ionicons name="add" size={14} color="#B45309" />
            </TouchableOpacity>
          ) : (
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleDecrement}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={14} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.stepperQty}>{inCartQty}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={handleIncrement}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardGrid: {
    width: '48%',
    marginBottom: spacing.md,
  },
  cardHorizontal: {
    width: 175,
    marginRight: spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  discountText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaBadge: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  infoContainer: {
    padding: spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  storeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  reviewsText: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  mrpText: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 6,
  },
});
