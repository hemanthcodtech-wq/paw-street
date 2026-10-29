import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  // Animation Values
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const pulseRing = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // 1. Continuous ambient glow pulsing animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseRing, {
            toValue: 1.45,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseRing, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulseLoop.start();

    // 2. Sequential Entrance Animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Auto navigate to Login Screen after 2.8 seconds
    const timer = setTimeout(() => {
      handleProceed();
    }, 2800);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  const handleProceed = () => {
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      {/* Ambient background decoration */}
      <View style={styles.decorCircleTop} />
      <View style={styles.decorCircleBottom} />

      <TouchableOpacity
        style={styles.touchableArea}
        onPress={handleProceed}
        activeOpacity={1}
      >
        {/* Animated Brand Logo Container */}
        <View style={styles.logoWrapper}>
          {/* Pulsing Aura Rings */}
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseRing }],
                opacity: pulseOpacity,
              },
            ]}
          />

          {/* Central Animated Badge */}
          <Animated.View
            style={[
              styles.logoBadge,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
            <View style={styles.innerLogoCircle}>
              <Text style={styles.pawEmoji}>🐾</Text>
            </View>
          </Animated.View>
        </View>

        {/* Brand Text Content */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: textTranslateY }],
              opacity: textOpacity,
            },
          ]}
        >
          {/* Express Delivery Pill */}
          <Animated.View
            style={[
              styles.speedPill,
              {
                transform: [{ scale: badgeScale }],
              },
            ]}
          >
            <Ionicons name="flash" size={13} color="#D97706" />
            <Text style={styles.speedPillText}>15-MIN EXPRESS DELIVERY</Text>
          </Animated.View>

          <Text style={styles.brandTitle}>
            Paw <Text style={styles.brandTitleAccent}>Street</Text>
          </Text>
          <Text style={styles.brandTagline}>
            Your Neighborhood Pet Care & Essentials
          </Text>

          {/* Feature Highlights Row */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🍖</Text>
              <Text style={styles.featureText}>Food & Treats</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✂️</Text>
              <Text style={styles.featureText}>Grooming</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🏥</Text>
              <Text style={styles.featureText}>Vet Care</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Loading Indicator & Tap to Continue */}
        <View style={styles.bottomFooter}>
          <View style={styles.loadingDotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.tapToSkip}>Tap anywhere to continue ➔</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark luxurious canvas
    position: 'relative',
    overflow: 'hidden',
  },
  touchableArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  decorCircleTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 183, 3, 0.12)',
  },
  decorCircleBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(33, 158, 188, 0.1)',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.xl,
  },
  pulseCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 183, 3, 0.35)',
  },
  logoBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  innerLogoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawEmoji: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
  },
  speedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 5,
    marginBottom: 12,
  },
  speedPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandTitleAccent: {
    color: colors.primary,
  },
  brandTagline: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
    marginBottom: 24,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  featureIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  featureDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    gap: 8,
  },
  loadingDotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 18,
  },
  tapToSkip: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});
