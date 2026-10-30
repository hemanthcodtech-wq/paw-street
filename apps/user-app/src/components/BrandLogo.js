import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const logoAsset = require('../../assets/logo.png');

export default function BrandLogo({ size = 'large', subtitle = 'PAW NEAR', dark = false }) {
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [scaleAnim, opacityAnim, pulseAnim]);

  const isSmall = size === 'small';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      {/* Official Website Logo */}
      <View style={[styles.markContainer, isSmall && styles.markSmall]}>
        <View style={styles.haloGlow} />
        <View style={[styles.logoCard, isSmall && styles.logoCardSmall]}>
          <Image
            source={logoAsset}
            style={[styles.logoImage, isSmall ? styles.logoImageSmall : styles.logoImageLarge]}
            resizeMode="contain"
          />
        </View>
      </View>

      {subtitle ? (
        <View style={styles.subtitleBadge}>
          <Text style={styles.subtitleText}>{subtitle.toUpperCase()}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  markSmall: {
    marginBottom: 4,
  },
  haloGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 183, 3, 0.25)',
  },
  logoCard: {
    padding: 6,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  logoCardSmall: {
    padding: 3,
    borderRadius: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 22,
  },
  logoImageLarge: {
    width: 110,
    height: 110,
    borderRadius: 24,
  },
  logoImageSmall: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  subtitleBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 183, 3, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.35)',
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1.2,
  },
});
