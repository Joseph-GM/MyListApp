import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ListItem as ListItemType } from '../types';

interface Props {
  item: ListItemType;
  onDelete: (id: string) => void;
  onPress: (item: ListItemType) => void;
  onToggle: (id: string) => void;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export default function ListItemRow({ item, onDelete, onPress, onToggle }: Props) {
  // 스와이프로 지우든, 오른쪽 끝 삭제 아이콘을 누르든 동일하게 확인창을 거친다.
  const confirmDelete = () => {
    Alert.alert('삭제할까요?', `"${item.title}" 항목을 삭제합니다.`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  };

  // naver.me / map.naver.com, maps.app.goo.gl / google.com/maps 같은 정상 공유
  // 링크는 해당 지도 앱이 설치돼 있으면 iOS가 유니버설 링크로 그 앱을 열어준다.
  // 앱이 없거나 URL 자체가 유효하지 않으면 조용히 실패하는 대신 안내창을 띄운다.
  const openUrl = async () => {
    if (!item.url) return;
    try {
      const supported = await Linking.canOpenURL(item.url);
      if (!supported) throw new Error('unsupported url');
      await Linking.openURL(item.url);
    } catch {
      Alert.alert('링크를 열 수 없어요', '저장된 주소를 다시 확인해 주세요.');
    }
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
      <Text style={styles.deleteText}>삭제</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
          onPress={() => onToggle(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.content} onPress={() => onPress(item)} activeOpacity={0.7}>
          <Text style={[styles.title, item.completed && styles.titleChecked]}>{item.title}</Text>
          {!!item.url && (
            <TouchableOpacity onPress={openUrl}>
              <Text style={styles.link} numberOfLines={1}>
                {item.url}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.date}>수정: {formatDate(item.updatedAt)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteIconBtn}
          onPress={confirmDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#bbb',
    marginRight: 12,
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#2f6fed', borderColor: '#2f6fed' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700', lineHeight: 14 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#222' },
  titleChecked: { color: '#aaa', textDecorationLine: 'line-through' },
  link: { fontSize: 13, color: '#2f6fed', marginTop: 4 },
  date: { fontSize: 12, color: '#999', marginTop: 4 },
  deleteIconBtn: {
    marginLeft: 8,
    marginTop: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  deleteIcon: { fontSize: 18 },
  deleteBtn: {
    backgroundColor: '#e5484d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
});
