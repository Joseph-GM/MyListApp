import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ListPage } from '../types';

interface Props {
  page: ListPage;
  onDelete: (id: string) => void;
  onPress: (page: ListPage) => void;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export default function ListPageRow({ page, onDelete, onPress }: Props) {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(page.id)}>
      <Text style={styles.deleteText}>삭제</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.row} onPress={() => onPress(page)} activeOpacity={0.7}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.meta}>
          항목 {page.items.length}개 · 수정: {formatDate(page.updatedAt)}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 16, fontWeight: '600', color: '#222' },
  meta: { fontSize: 12, color: '#999', marginTop: 4 },
  deleteBtn: {
    backgroundColor: '#e5484d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
});
