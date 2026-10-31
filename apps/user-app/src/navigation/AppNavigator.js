import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ServicesScreen from '../screens/ServicesScreen';
import StoresScreen from '../screens/StoresScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import AccountScreen from '../screens/AccountScreen';
import ChatBotScreen from '../screens/ChatBotScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomBottomTabBar({ state, descriptors, navigation }) {
  const { totalItemCount } = useCart();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const bottomPadding = insets.bottom > 0 ? insets.bottom : (isWeb ? 8 : (Platform.OS === 'android' ? 10 : 8));

  return (
    <View style={styles.customTabBarContainer}>
      <View style={[styles.customTabBar, { paddingBottom: bottomPadding }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

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
          if (route.name === 'HomeTab') iconName = isFocused ? 'paw' : 'paw-outline';
          else if (route.name === 'CatalogTab') iconName = isFocused ? 'grid' : 'grid-outline';
          else if (route.name === 'ServicesTab') iconName = isFocused ? 'cut' : 'cut-outline';
          else if (route.name === 'StoresTab') iconName = isFocused ? 'storefront' : 'storefront-outline';
          else if (route.name === 'CartTab') iconName = isFocused ? 'bag-handle' : 'bag-handle-outline';
          else if (route.name === 'AccountTab') iconName = isFocused ? 'person' : 'person-outline';

          const color = isFocused ? colors.primaryDark : colors.textSecondary;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.customTabItem}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrapper}>
                <Ionicons name={iconName} size={22} color={color} />
                {route.name === 'CartTab' && totalItemCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{totalItemCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.customTabLabel,
                  { color, fontWeight: isFocused ? '800' : '600' }
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      backBehavior="history"
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CatalogTab" component={CatalogScreen} options={{ tabBarLabel: 'Shop' }} />
      <Tab.Screen name="ServicesTab" component={ServicesScreen} options={{ tabBarLabel: 'Services' }} />
      <Tab.Screen name="StoresTab" component={StoresScreen} options={{ tabBarLabel: 'Stores' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            headerShown: true,
            title: 'Order Checkout',
            headerStyle: { backgroundColor: '#FFF' },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontWeight: '800' }
          }}
        />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{
            headerShown: true,
            title: 'Live Order Tracker',
            headerStyle: { backgroundColor: '#FFF' },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontWeight: '800' }
          }}
        />
        <Stack.Screen name="ChatBot" component={ChatBotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customTabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  customTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
  },
  customTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabIconWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  customTabLabel: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});

