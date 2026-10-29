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
      navigation.replace('PartnerWelcome');
    });
  }, [navigation, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Decorative ambient background */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Animated Brand Logo in Exact Logo Colors on White */}
      <View style={styles.logoWrapper}>
        <BrandLogo size="large" subtitle="Partner Portal" dark={false} />
      </View>

      <Text style={styles.title}>Vendor & Fleet Operations</Text>
      <Text style={styles.subtitle}>Store Management • Quick Delivery Dispatch</Text>

      {/* Animated Progress Bar in Logo Gold */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
      <Text style={styles.loadingText}>Connecting to Partner Engine...</Text>

      {/* Skip button for instant testing */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.replace('PartnerWelcome')}
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
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 183, 3, 0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(251, 133, 0, 0.08)',
  },
  logoWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
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
