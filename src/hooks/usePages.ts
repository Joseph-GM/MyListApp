import { useEffect, useState, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { ListItem, ListPage, ListKey } from '../types';
import { loadPages, savePages } from '../storage/storage';
import { normalizeUrl } from '../utils/url';

// 하나의 탭(할 일/구매/가고 싶은 곳) 안에 있는 여러 리스트(페이지)와
// 그 안의 항목(items)을 함께 관리하는 훅.
export function usePages(key: ListKey) {
  const [pages, setPages] = useState<ListPage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await loadPages(key);
      data.sort((a, b) => b.updatedAt - a.updatedAt);
      setPages(data);
      setLoaded(true);
    })();
  }, [key]);

  const persist = useCallback(
    (next: ListPage[]) => {
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      setPages(next);
      savePages(key, next);
    },
    [key],
  );

  const addPage = useCallback(
    (title: string) => {
      const now = Date.now();
      const newPage: ListPage = {
        id: uuid.v4() as string,
        title: title.trim(),
        createdAt: now,
        updatedAt: now,
        items: [],
      };
      persist([newPage, ...pages]);
    },
    [pages, persist],
  );

  const updatePage = useCallback(
    (id: string, title: string) => {
      const next = pages.map(p =>
        p.id === id ? { ...p, title: title.trim(), updatedAt: Date.now() } : p,
      );
      persist(next);
    },
    [pages, persist],
  );

  const deletePage = useCallback(
    (id: string) => {
      persist(pages.filter(p => p.id !== id));
    },
    [pages, persist],
  );

  const addItem = useCallback(
    (pageId: string, title: string, url?: string) => {
      const now = Date.now();
      const newItem: ListItem = {
        id: uuid.v4() as string,
        title: title.trim(),
        url: url?.trim() ? normalizeUrl(url) : undefined,
        createdAt: now,
        updatedAt: now,
      };
      const next = pages.map(p =>
        p.id === pageId ? { ...p, updatedAt: now, items: [newItem, ...p.items] } : p,
      );
      persist(next);
    },
    [pages, persist],
  );

  const updateItem = useCallback(
    (pageId: string, itemId: string, title: string, url?: string) => {
      const now = Date.now();
      const next = pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              updatedAt: now,
              items: p.items.map(it =>
                it.id === itemId
                  ? {
                      ...it,
                      title: title.trim(),
                      url: url?.trim() ? normalizeUrl(url) : undefined,
                      updatedAt: now,
                    }
                  : it,
              ),
            }
          : p,
      );
      persist(next);
    },
    [pages, persist],
  );

  const deleteItem = useCallback(
    (pageId: string, itemId: string) => {
      const now = Date.now();
      const next = pages.map(p =>
        p.id === pageId
          ? { ...p, updatedAt: now, items: p.items.filter(it => it.id !== itemId) }
          : p,
      );
      persist(next);
    },
    [pages, persist],
  );

  const toggleItem = useCallback(
    (pageId: string, itemId: string) => {
      const now = Date.now();
      const next = pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              updatedAt: now,
              items: p.items.map(it =>
                it.id === itemId ? { ...it, completed: !it.completed, updatedAt: now } : it,
              ),
            }
          : p,
      );
      persist(next);
    },
    [pages, persist],
  );

  return {
    pages,
    loaded,
    addPage,
    updatePage,
    deletePage,
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
  };
}
