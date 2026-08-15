export type ListKey = 'todo' | 'buy' | 'go';

export interface ListItem {
  id: string;
  title: string;
  url?: string;       // go 리스트 아이템 전용 (네이버/구글 지도 링크)
  completed?: boolean; // 체크(완료) 여부 — 체크되면 제목에 취소선 표시
  createdAt: number;
  updatedAt: number;
}

// 각 탭(할 일/구매/가고 싶은 곳) 안의 개별 리스트.
// 예: To-Do 탭 안에 "list1", "list2" 같은 페이지가 여러 개 있고,
// 각 페이지 안에 실제 항목(items)이 들어간다.
export interface ListPage {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;   // 페이지 자체 또는 하위 항목이 변경될 때마다 갱신
  items: ListItem[];
}
