// NOTE: This legacy combined app has been split into two standalone mobile applications:
// 1. apps/user-app (Paw Street Customer Mobile App)
// 2. apps/partner-app (Paw Street Partner Mobile App - Vendor & Delivery Fleet)
// Please run or build either `apps/user-app` or `apps/partner-app`.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DeprecatedMobileApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Codebase Split Notice</Text>
      <Text style={styles.text}>
        This single app has been separated into two dedicated applications:
      </Text>
      <Text style={styles.appItem}>• apps/user-app (Customer App)</Text>
      <Text style={styles.appItem}>• apps/partner-app (Vendor & Delivery Partner App)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FAF7F2' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 10, color: '#0F172A' },
  text: { fontSize: 14, textAlign: 'center', marginBottom: 12, color: '#64748B' },
  appItem: { fontSize: 14, fontWeight: '700', color: '#EA580C', marginVertical: 4 }
});
