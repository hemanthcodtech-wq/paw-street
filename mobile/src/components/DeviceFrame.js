import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function DeviceFrame({ children }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isWeb = Platform.OS === 'web';
  // On real Android / iOS devices or APK, render native full-screen with zero mockup bezels
  if (!isWeb) {
    return <View style={styles.nativeAppContainer}>{children}</View>;
  }

  // On Web: if mobile browser screen width <= 540, expand to full screen
  if (windowWidth <= 540) {
    return <View style={styles.nativeAppContainer}>{children}</View>;
  }

  // Sized to fit comfortably inside any laptop browser, leaving generous space above Windows taskbar
  const chassisHeight = Math.min(windowHeight * 0.78, 590);

  // On Desktop Web Browser: Render compact, perfectly proportioned mobile frame
  return (
    <View style={styles.desktopCanvas}>
      <View style={styles.frameWrapper}>
        <View style={[styles.deviceChassis, { height: chassisHeight }]}>
          {/* Subtle Side Hardware Silhouettes */}
          <View style={styles.volumeUpBtn} />
          <View style={styles.volumeDownBtn} />
          <View style={styles.powerBtn} />

          {/* Dynamic Island Pill */}
          <View style={styles.dynamicIslandContainer}>
            <View style={styles.dynamicIsland}>
              <View style={styles.cameraLens} />
              <View style={styles.sensorDot} />
            </View>
          </View>

          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.statusTime}>{currentTime}</Text>
            <View style={styles.statusIcons}>
              <Ionicons name="cellular" size={13} color="#0F172A" />
              <Ionicons name="wifi" size={13} color="#0F172A" />
              <Ionicons name="battery-full" size={16} color="#0F172A" />
            </View>
          </View>

          {/* Main App Interactive Viewport (Contains entire app & custom bottom tab bar with 100% visibility) */}
          <View style={styles.appViewport}>
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeAppContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  desktopCanvas: {
    flex: 1,
    height: '100vh',
    maxHeight: '100vh',
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: 12,
  },
  frameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceChassis: {
    width: 345,
    maxHeight: '80vh',
    backgroundColor: colors.background,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: '#1E293B',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  volumeUpBtn: {
    position: 'absolute',
    left: -9,
    top: 90,
    width: 3,
    height: 34,
    backgroundColor: '#334155',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeDownBtn: {
    position: 'absolute',
    left: -9,
    top: 132,
    width: 3,
    height: 34,
    backgroundColor: '#334155',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  powerBtn: {
    position: 'absolute',
    right: -9,
    top: 110,
    width: 3,
    height: 45,
    backgroundColor: '#334155',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  dynamicIslandContainer: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  dynamicIsland: {
    width: 84,
    height: 20,
    backgroundColor: '#000000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 7,
    gap: 5,
  },
  cameraLens: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  sensorDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#0284C7',
  },
  statusBar: {
    height: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  statusTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appViewport: {
    flex: 1,
    overflow: 'hidden',
  },
});
