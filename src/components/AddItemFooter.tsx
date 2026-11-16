import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void;
  label?: string;
}

// 페이지 안 아이템 목록의 맨 아래에 붙는 "+ 아이템 추가" 버튼.
// 페이지 추가용 FAB(파란 원형 버튼)와 헷갈리지 않도록 점선 테두리의 인라인 행 디자인을 사용하고,
// FlatList의 ListFooterComponent로 들어가 아이템이 추가될 때마다 함께 아래로 내려간다.
export default function AddItemFooter({ onPress, label = '아이템 추가' }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Text style={styles.plus}>+</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9db8f5',
    backgroundColor: '#fff',
  },
  plus: { fontSize: 20, lineHeight: 22, color: '#2f6fed', fontWeight: '600', marginRight: 6 },
  label: { fontSize: 15, color: '#2f6fed', fontWeight: '600' },
});
