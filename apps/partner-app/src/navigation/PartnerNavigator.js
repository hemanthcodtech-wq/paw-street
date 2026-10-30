import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePartnerAuth } from '../context/PartnerAuthContext';
import { colors } from '../theme/colors';

// Screens
import SplashScreen from '../screens/SplashScreen';
import PartnerWelcomeScreen from '../screens/auth/PartnerWelcomeScreen';
import VendorAuthScreen from '../screens/auth/VendorAuthScreen';
import DeliveryAuthScreen from '../screens/auth/DeliveryAuthScreen';
import VendorDashboardScreen from '../screens/vendor/VendorDashboardScreen';
import VendorOrdersScreen from '../screens/vendor/VendorOrdersScreen';
import VendorProductsScreen from '../screens/vendor/VendorProductsScreen';
import VendorEarningsScreen from '../screens/vendor/VendorEarningsScreen';
import VendorProfileScreen from '../screens/vendor/VendorProfileScreen';

import DeliveryDashboardScreen from '../screens/delivery/DeliveryDashboardScreen';
import ActiveDeliveryScreen from '../screens/delivery/ActiveDeliveryScreen';
import DeliveryHistoryScreen from '../screens/delivery/DeliveryHistoryScreen';
import DeliveryWalletScreen from '../screens/delivery/DeliveryWalletScreen';
import DeliveryProfileScreen from '../screens/delivery/DeliveryProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomPartnerTabBar({ state, descriptors, navigation, activeThemeColor }) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const bottomPadding = insets.bottom > 0 ? insets.bottom : (isWeb ? 8 : (Platform.OS === 'android' ? 10 : 8));

  return (
    <View style={styles.tabContainer}>
      <View style={[styles.tabBar, { paddingBottom: bottomPadding }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName;
          if (route.name === 'VendorHomeTab' || route.name === 'DutyTab') iconName = isFocused ? 'grid' : 'grid-outline';
          else if (route.name === 'OrdersTab') iconName = isFocused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'ProductsTab') iconName = isFocused ? 'cube' : 'cube-outline';
          else if (route.name === 'ActiveDeliveryTab') iconName = isFocused ? 'bicycle' : 'bicycle-outline';
          else if (route.name === 'HistoryTab') iconName = isFocused ? 'time' : 'time-outline';
          else if (route.name === 'EarningsTab' || route.name === 'WalletTab') iconName = isFocused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'VendorProfileTab' || route.name === 'RiderProfileTab') iconName = isFocused ? 'person' : 'person-outline';

          const color = isFocused ? activeThemeColor : colors.textSecondary;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons name={iconName} size={20} color={color} style={{ marginBottom: 3 }} />
              <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '800' : '600' }]} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function VendorTabNavigator() {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 0 : Math.max(insets.top, Platform.OS === 'android' ? ((RNStatusBar.currentHeight || 28) + 6) : 0);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomPartnerTabBar {...props} activeThemeColor={colors.vendor} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ paddingTop: topInset, backgroundColor: '#FAF7F2' }}
    >
      <Tab.Screen name="VendorHomeTab" component={VendorDashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="OrdersTab" component={VendorOrdersScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="ProductsTab" component={VendorProductsScreen} options={{ tabBarLabel: 'Catalog' }} />
      <Tab.Screen name="EarningsTab" component={VendorEarningsScreen} options={{ tabBarLabel: 'Payouts' }} />
      <Tab.Screen name="VendorProfileTab" component={VendorProfileScreen} options={{ tabBarLabel: 'Store' }} />
    </Tab.Navigator>
  );
}

function DeliveryTabNavigator() {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 0 : Math.max(insets.top, Platform.OS === 'android' ? ((RNStatusBar.currentHeight || 28) + 6) : 0);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomPartnerTabBar {...props} activeThemeColor={colors.delivery} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ paddingTop: topInset, backgroundColor: '#FAF7F2' }}
    >
      <Tab.Screen name="DutyTab" component={DeliveryDashboardScreen} options={{ tabBarLabel: 'Duty Hub' }} />
      <Tab.Screen name="ActiveDeliveryTab" component={ActiveDeliveryScreen} options={{ tabBarLabel: 'Active Trip' }} />
      <Tab.Screen name="HistoryTab" component={DeliveryHistoryScreen} options={{ tabBarLabel: 'Trips' }} />
      <Tab.Screen name="WalletTab" component={DeliveryWalletScreen} options={{ tabBarLabel: 'Wallet' }} />
      <Tab.Screen name="RiderProfileTab" component={DeliveryProfileScreen} options={{ tabBarLabel: 'Captain' }} />
    </Tab.Navigator>
  );
}

function MainRoleTabs() {
  const { partnerRole } = usePartnerAuth();
  return partnerRole === 'vendor' ? <VendorTabNavigator /> : <DeliveryTabNavigator />;
}

export default function PartnerNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="PartnerWelcome" component={PartnerWelcomeScreen} />
        <Stack.Screen name="VendorAuth" component={VendorAuthScreen} />
        <Stack.Screen name="DeliveryAuth" component={DeliveryAuthScreen} />
        <Stack.Screen name="MainTabs" component={MainRoleTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
});

