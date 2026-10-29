import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DeviceFrame({ children, isDark = false }) {
  if (Platform.OS !== 'web') {
    return <View style={styles.nativeRoot}>{children}</View>;
  }

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '');

  return (
    <View style={styles.desktopBackdrop}>
      {/* Decorative desktop background elements */}
      <View style={styles.glowBlob1} />
      <View style={styles.glowBlob2} />

      {/* Realistic Smartphone Chassis */}
      <View style={styles.phoneChassis}>
        {/* Outer Titanium Bezel */}
        <View style={styles.outerBezel}>
          {/* Inner Screen Container */}
          <View style={[styles.innerScreen, { backgroundColor: isDark ? '#0B0F19' : '#FAF7F2' }]}>
            
            {/* Top Phone Status Bar & Dynamic Island */}
            <View style={styles.statusBarContainer}>
              <Text style={[styles.statusTime, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {timeString || '9:41'}
              </Text>

              {/* Dynamic Island / Camera Notch */}
              <View style={styles.dynamicIsland}>
                <View style={styles.cameraLens} />
                <View style={styles.sensorDot} />
              </View>

              {/* Status Icons */}
              <View style={styles.statusIcons}>
                <Ionicons name="cellular" size={13} color={isDark ? '#F8FAFC' : '#0F172A'} />
                <Ionicons name="wifi" size={13} color={isDark ? '#F8FAFC' : '#0F172A'} />
                <View style={[styles.batteryIcon, { borderColor: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  <View style={[styles.batteryFill, { backgroundColor: isDark ? '#F8FAFC' : '#0F172A' }]} />
                </View>
              </View>
            </View>

            {/* App Content */}
            <View style={styles.screenContent}>
              {children}
            </View>

            {/* Bottom Home Indicator Bar */}
            <View style={styles.homeBarContainer}>
              <View style={[styles.homeBar, { backgroundColor: isDark ? '#94A3B8' : '#64748B' }]} />
            </View>

          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeRoot: {
    flex: 1,
  },
  desktopBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#090D16',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  glowBlob1: {
    position: 'absolute',
    top: -120,
    left: -100,
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(255, 183, 3, 0.08)',
  },
  glowBlob2: {
    position: 'absolute',
    bottom: -120,
    right: -100,
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  phoneChassis: {
    width: '100%',
    maxWidth: 416,
    height: '100%',
    maxHeight: 890,
    borderRadius: 54,
    backgroundColor: '#1E293B',
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.65,
    shadowRadius: 40,
    borderWidth: 2,
    borderColor: '#334155',
  },
  outerBezel: {
    flex: 1,
    borderRadius: 44,
    backgroundColor: '#0F172A',
    padding: 4,
    overflow: 'hidden',
  },
  innerScreen: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  statusBarContainer: {
    height: 38,
    paddingHorizontal: 22,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9999,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  dynamicIsland: {
    width: 108,
    height: 25,
    backgroundColor: '#000000',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    gap: 6,
  },
  cameraLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  sensorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0284C7',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  batteryIcon: {
    width: 18,
    height: 9,
    borderWidth: 1,
    borderRadius: 3,
    padding: 1,
    justifyContent: 'center',
  },
  batteryFill: {
    width: '80%',
    height: '100%',
    borderRadius: 1.5,
  },
  screenContent: {
    flex: 1,
    position: 'relative',
  },
  homeBarContainer: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBar: {
    width: 130,
    height: 4,
    borderRadius: 2,
  },
});
