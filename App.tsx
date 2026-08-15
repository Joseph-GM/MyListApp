import 'react-native-gesture-handler'; // 반드시 최상단에서 import
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <StatusBar barStyle="dark-content" />
          <TabNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}