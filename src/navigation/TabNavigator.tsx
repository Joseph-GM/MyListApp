import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TodoWrapper from '../screens/TodoWrapper';
import BuyScreen from '../screens/BuyScreen';
import GoScreen from '../screens/GoScreen';

// createMaterialTopTabNavigator(react-native-pager-view 기반)에서 탭 전환이
// 되지 않는 문제가 있어, 네이티브 페이저 없이 동작하는 단순 탭바로 대체.
// 아이콘은 아이콘 폰트 라이브러리(예: react-native-vector-icons) 대신
// 이모지를 써서 추가 네이티브 링크/pod install 없이 바로 적용되게 함.
const TABS = [
  { key: 'todo', label: 'To-Do', icon: '📝', Component: TodoWrapper },
  { key: 'buy', label: 'To-Buy', icon: '🛒', Component: BuyScreen },
  { key: 'go', label: 'To-Go', icon: '✈️', Component: GoScreen },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function TabNavigator() {
  const [active, setActive] = useState<TabKey>('todo');
  const ActiveComponent = TABS.find(t => t.key === active)!.Component;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setActive(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {active === tab.key && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.screen}>
        <ActiveComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 13, fontWeight: '600', color: '#999' },
  tabLabelActive: { color: '#2f6fed' },
  indicator: {
    marginTop: 8,
    height: 2,
    width: '60%',
    backgroundColor: '#2f6fed',
    borderRadius: 1,
  },
  screen: { flex: 1 },
});
