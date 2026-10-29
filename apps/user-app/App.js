import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import AppNavigator from './src/navigation/AppNavigator';
import DeviceFrame from './src/components/DeviceFrame';
import { colors } from './src/theme/colors';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'paw-user-style-reset';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      html, body, #root {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background-color: #090D16 !important;
      }
      *, *::before, *::after, input, textarea, select, button, [tabindex], [role="button"] {
        outline: none !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      input::-ms-reveal, input::-ms-clear {
        display: none !important;
      }
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function GlobalToast() {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toast}>
        <View style={styles.toastDot} />
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <DeviceFrame isDark={false}>
              <AppNavigator />
              <GlobalToast />
              <StatusBar style="dark" />
            </DeviceFrame>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

