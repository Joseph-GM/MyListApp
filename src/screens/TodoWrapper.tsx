import React from 'react';
import GenericListScreen from './TodoScreen';

export default function TodoWrapper() {
  return (
    <GenericListScreen
      listKey="todo"
      emptyPageText="할 일 목록이 없습니다"
      emptyItemText="할 일이 없습니다"
    />
  );
}
