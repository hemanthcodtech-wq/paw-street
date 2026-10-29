import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PartnerAuthProvider } from './src/context/PartnerAuthContext';
import { VendorProvider } from './src/context/VendorContext';
import { DeliveryProvider } from './src/context/DeliveryContext';
import PartnerNavigator from './src/navigation/PartnerNavigator';
import DeviceFrame from './src/components/DeviceFrame';
import { colors } from './src/theme/colors';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'paw-partner-style-reset';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      html, body, #root {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background-color: #05070B !important;
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

export default function App() {
  return (
    <SafeAreaProvider>
      <PartnerAuthProvider>
        <VendorProvider>
          <DeliveryProvider>
            <DeviceFrame isDark={false}>
              <PartnerNavigator />
              <StatusBar style="dark" />
            </DeviceFrame>
          </DeliveryProvider>
        </VendorProvider>
      </PartnerAuthProvider>
    </SafeAreaProvider>
  );
}
