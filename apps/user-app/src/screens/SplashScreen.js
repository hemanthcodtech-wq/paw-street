import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import BrandLogo from '../components/BrandLogo';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace('Auth');
    });
  }, [navigation, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Decorative background glow */}
      <View style={styles.topOrb} />
      <View style={styles.bottomOrb} />

      {/* Animated Brand Logo */}
      <View style={styles.logoWrapper}>
        <BrandLogo size="large" subtitle="The Paw Street" dark={false} />
      </View>

      <Text style={styles.tagline}>Premium Care for Your Furry Family</Text>
      <Text style={styles.subTagline}>⚡ 15-Minute Flash Delivery to Your Doorstep</Text>

      {/* Animated Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
      <Text style={styles.loadingText}>Initializing Pet Store Engine...</Text>

      {/* Skip button for instant testing */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.replace('Auth')}
      >
        <Text style={styles.skipText}>Skip Animation →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
  },
  topOrb: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 183, 3, 0.12)',
  },
  bottomOrb: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(251, 133, 0, 0.1)',
  },
  logoWrapper: {
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subTagline: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 36,
  },
  progressTrack: {
    width: 180,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FB8500',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  skipBtn: {
    position: 'absolute',
    bottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
});
