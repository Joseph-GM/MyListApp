import React from 'react';
import GenericListScreen from './TodoScreen';

export default function BuyScreen() {
  return (
    <GenericListScreen
      listKey="buy"
      emptyPageText="구매 목록이 없습니다"
      emptyItemText="구매할 항목이 없습니다"
    />
  );
}
