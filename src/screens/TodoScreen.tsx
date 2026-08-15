import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePages } from '../hooks/usePages';
import ListPageRow from '../components/ListPageRow';
import ListItemRow from '../components/ListItem';
import AddItemModal from '../components/AddItemModal';
import { ListItem } from '../types';

interface Props {
  listKey: 'todo' | 'buy';
  emptyPageText: string;
  emptyItemText: string;
}

// 1단계: 이 탭 안의 리스트(페이지) 목록 (+ 는 리스트 생성)
// 2단계: 리스트 하나를 선택하면 그 안의 항목 목록 (+ 는 항목 추가)
export default function GenericListScreen({ listKey, emptyPageText, emptyItemText }: Props) {
  const { pages, addPage, deletePage, addItem, updateItem, deleteItem, toggleItem } =
    usePages(listKey);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const [pageModalVisible, setPageModalVisible] = useState(false);

  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);

  const selectedPage = pages.find(p => p.id === selectedPageId) ?? null;

  const handlePageSubmit = (title: string) => addPage(title);

  const openAddItem = () => {
    setEditingItem(null);
    setItemModalVisible(true);
  };

  const openEditItem = (item: ListItem) => {
    setEditingItem(item);
    setItemModalVisible(true);
  };

  const handleItemSubmit = (title: string) => {
    if (!selectedPage) return;
    if (editingItem) {
      updateItem(selectedPage.id, editingItem.id, title);
    } else {
      addItem(selectedPage.id, title);
    }
  };

  if (selectedPage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedPageId(null)} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 목록</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {selectedPage.title}
          </Text>
        </View>

        <FlatList
          data={selectedPage.items}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <ListItemRow
              item={item}
              onDelete={id => deleteItem(selectedPage.id, id)}
              onPress={openEditItem}
              onToggle={id => toggleItem(selectedPage.id, id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>{emptyItemText}</Text>}
        />

        <TouchableOpacity style={styles.fab} onPress={openAddItem}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <AddItemModal
          visible={itemModalVisible}
          titleLabel="아이템"
          initialTitle={editingItem?.title}
          onClose={() => setItemModalVisible(false)}
          onSubmit={handleItemSubmit}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <ListPageRow page={item} onDelete={deletePage} onPress={p => setSelectedPageId(p.id)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>{emptyPageText}</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setPageModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddItemModal
        visible={pageModalVisible}
        onClose={() => setPageModalVisible(false)}
        onSubmit={handlePageSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { paddingRight: 10, paddingVertical: 4 },
  backText: { fontSize: 15, color: '#2f6fed', fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#222' },
  empty: { textAlign: 'center', marginTop: 60, color: '#aaa' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2f6fed',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
