import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  House,
  Compass,
  ClipboardText,
  ShoppingCart,
  User,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { useCartStore } from '../../stores/cartStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabItem = {
  name: string;
  title: string;
  icon: React.ComponentType<any>;
  route: string;
};

const tabs: TabItem[] = [
  { name: 'home', title: 'Home', icon: House, route: '/(tabs)' },
  { name: 'explore', title: 'Explore', icon: Compass, route: '/(tabs)/explore' },
  { name: 'orders', title: 'Orders', icon: ClipboardText, route: '/(tabs)/orders' },
  { name: 'cart', title: 'Cart', icon: ShoppingCart, route: '/(tabs)/cart' },
  { name: 'profile', title: 'Profile', icon: User, route: '/(tabs)/profile' },
];

export default function FloatingTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const insets = useSafeAreaInsets();

  const isTabActive = (tabRoute: string, tabName: string) => {
    if (tabName === 'home' && (pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index')) {
      return true;
    }
    return pathname.includes(tabRoute);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || Spacing.sm }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.route, tab.name);
          const IconComponent = tab.icon;
          const showBadge = tab.name === 'cart' && cartItemCount > 0;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconComponent
                  size={26}
                  color={isActive ? Colors.primary : Colors.tabBarInactive}
                  weight={isActive ? 'fill' : 'duotone'}
                />
                {showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.tabLabel,
                { color: isActive ? Colors.primary : Colors.tabBarInactive }
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.tabBarBackground,
    borderTopWidth: 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
  },
  tabLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    marginTop: 2,
  },
});
