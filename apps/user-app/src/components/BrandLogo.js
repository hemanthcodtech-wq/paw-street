import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function BrandLogo({ size = 'large', subtitle = 'The Paw Street', dark = false }) {
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
            source={{ uri: '/logo.png' }}
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
    width: 140,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
  },
  logoCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logoCardSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  logoImage: {
    width: 180,
    height: 48,
  },
  logoImageLarge: {
    width: 210,
    height: 56,
  },
  logoImageSmall: {
    width: 130,
    height: 34,
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
