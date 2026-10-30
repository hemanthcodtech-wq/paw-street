import React from 'react';
import { View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeScreen({ children, style, backgroundColor }) {
  const insets = useSafeAreaInsets();
  const top = Platform.OS === 'web'
    ? 0
    : Math.max(insets.top, Platform.OS === 'android' ? ((RNStatusBar.currentHeight || 28) + 6) : 0);

  return (
    <View style={[{ flex: 1, paddingTop: top }, backgroundColor ? { backgroundColor } : null, style]}>
      {children}
    </View>
  );
}
