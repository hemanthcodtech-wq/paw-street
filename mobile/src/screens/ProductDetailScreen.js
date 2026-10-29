import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  const { addToCart, items, updateQuantity, toggleWishlist, isWishlisted } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await api.getProductById(productId);
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0].size);
      } else {
        setSelectedSize('Standard');
      }
    } catch (e) {
      console.warn('Error loading product details:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  const currentSizeObj = product.sizes?.find(s => s.size === selectedSize);
  const currentPrice = currentSizeObj?.price || product.price;
  const currentMrp = currentSizeObj?.mrp || product.mrp;
  const wishlisted = isWishlisted(product.id);

  const cartItem = items.find(i => i.id === product.id && i.selectedSize === selectedSize);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Floating Navigation */}
      <View style={styles.floatingNav}>
        <TouchableOpacity style={styles.navCircle} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.navCircle} onPress={() => toggleWishlist(product)}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={wishlisted ? '#EF4444' : colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navCircle}
            onPress={() => navigation.navigate('CartTab')}
          >
            <Ionicons name="bag-handle-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Product Image */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}
        </View>

        {/* Content Container */}
        <View style={styles.content}>
          {/* Vendor & ETA */}
          <View style={styles.vendorRow}>
            <View style={styles.vendorTag}>
              <Ionicons name="shield-checkmark" size={13} color="#059669" />
              <Text style={styles.vendorText}>{product.storeName || 'Paw Street Verified Store'}</Text>
            </View>
            <View style={styles.etaPill}>
              <Ionicons name="flash" size={12} color="#D97706" />
              <Text style={styles.etaText}>{product.eta || '15 min delivery'}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{product.rating || 4.8}</Text>
            </View>
            <Text style={styles.reviewsText}>
              ({product.reviewsCount || 230} verified pet parent ratings)
            </Text>
          </View>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{currentPrice}</Text>
            {currentMrp && currentMrp > currentPrice && (
              <>
                <Text style={styles.mrp}>₹{currentMrp}</Text>
                <View style={styles.saveTag}>
                  <Text style={styles.saveText}>Save ₹{currentMrp - currentPrice}</Text>
                </View>
              </>
            )}
          </View>
          <Text style={styles.taxText}>Inclusive of all taxes</Text>

          {/* Size / Weight Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <Text style={styles.sectionLabel}>SELECT VARIANT / PACK SIZE</Text>
              <View style={styles.sizeRow}>
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s.size;
                  return (
                    <TouchableOpacity
                      key={s.size}
                      style={[styles.sizeChip, isSelected && styles.sizeChipSelected]}
                      onPress={() => setSelectedSize(s.size)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
                        {s.size}
                      </Text>
                      <Text style={[styles.sizePrice, isSelected && styles.sizePriceSelected]}>
                        ₹{s.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.sectionLabel}>PRODUCT DESCRIPTION</Text>
            <Text style={styles.descText}>
              {product.description ||
                'Formulated specifically to cater to your pets dietary and physical wellness. Contains pure ingredients, enriched with vital vitamins and natural minerals.'}
            </Text>
          </View>

          {/* Trust Guarantees */}
          <View style={styles.guaranteeBox}>
            <View style={styles.guaranteeItem}>
              <Ionicons name="checkmark-done-circle" size={20} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeTitle}>100% Genuine Pet Product</Text>
                <Text style={styles.guaranteeSub}>Directly sourced from authorized pet brands</Text>
              </View>
            </View>
            <View style={styles.guaranteeItem}>
              <Ionicons name="refresh-circle" size={20} color="#0284C7" />
              <View style={{ flex: 1 }}>
                <Text style={styles.guaranteeTitle}>Easy 7-Day Doorstep Replacement</Text>
                <Text style={styles.guaranteeSub}>Hassle-free support for sealed goods</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPrice}>₹{currentPrice}</Text>
          <Text style={styles.bottomSize}>{selectedSize}</Text>
        </View>

        {cartQty === 0 ? (
          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={18} color="#FFF" />
            <Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => updateQuantity(product.id, selectedSize, -1)}
            >
              <Ionicons name="remove" size={16} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.stepperQty}>{cartQty}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => updateQuantity(product.id, selectedSize, 1)}
            >
              <Ionicons name="add" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewCartBtn}
              onPress={() => navigation.navigate('CartTab')}
            >
              <Text style={styles.viewCartText}>Go to Cart</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingNav: {
    position: 'absolute',
    top: 40,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBox: {
    width: '100%',
    height: 320,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vendorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  reviewsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  mrp: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  saveTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  saveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  taxText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  sizeSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  sizeChipSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sizeTextSelected: {
    color: colors.primaryDark,
  },
  sizePrice: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sizePriceSelected: {
    color: '#92400E',
    fontWeight: '700',
  },
  descSection: {
    marginBottom: spacing.lg,
  },
  descText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  guaranteeBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 12,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  guaranteeSub: {
    fontSize: 11,
    color: colors.textSecondary,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomPriceCol: {
    flexDirection: 'column',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  bottomSize: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  addCartText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: 8,
  },
  viewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    marginLeft: 6,
    gap: 4,
  },
  viewCartText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
