import { Tabs } from 'expo-router';
import React from 'react';

import { TabsBottomTabBar } from '@/components/BottomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabsBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#ffffff' },
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="my-bookings" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="mypage" />
    </Tabs>
  );
}
