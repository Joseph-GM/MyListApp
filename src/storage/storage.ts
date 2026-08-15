import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListPage, ListKey } from '../types';

// v2: 저장 형태가 ListItem[] -> ListPage[] 로 바뀌어서 키를 분리함
// (예전 형태(ListItem[])와 섞이면 items 필드가 없어 오류가 남)
const storageKey = (key: ListKey) => `@my_list_app:v2:${key}`;

export async function loadPages(key: ListKey): Promise<ListPage[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(key));
    return raw ? (JSON.parse(raw) as ListPage[]) : [];
  } catch (e) {
    console.warn('loadPages error', e);
    return [];
  }
}

export async function savePages(key: ListKey, pages: ListPage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKey(key), JSON.stringify(pages));
  } catch (e) {
    console.warn('savePages error', e);
  }
}
