import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { useCartStore } from '../../stores/cartStore';

type TabIconProps = {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  focused: boolean;
  badge?: number;
};

const TabIcon = ({ name, color, focused, badge }: TabIconProps) => (
  <View style={styles.iconContainer}>
    <MaterialCommunityIcons
      name={focused ? name : (`${name}-outline` as any)}
      size={26}
      color={color}
    />
    {badge !== undefined && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    )}
  </View>
);

export default function TabLayout() {
  const cartItemCount = useCartStore((state) => state.getItemCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.tabBarBackground }]} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="compass" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="clipboard-text" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="cart" color={color} focused={focused} badge={cartItemCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="account" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70 + (Platform.OS === 'ios' ? 20 : 0),
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    borderTopWidth: 0,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.tabBarBackground,
    position: 'absolute',
  },
  tabBarLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
});
