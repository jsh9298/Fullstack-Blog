import { useState, useRef, useCallback, useEffect } from 'react';

interface UseDnDGuardProps<T> {
  items: T[];
  onReorder: (newItems: T[]) => void;
}

export function useDnDGuard<T>({ items, onReorder }: UseDnDGuardProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // DragEnter / DragLeave 간 자식 요소 교차로 인한 flickering 방지용 카운터
  const dragCounter = useRef<{ [key: number]: number }>({});

  // 1. ESC 키 누를 때 드래그 즉시 취소 가드
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && draggedIndex !== null) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        dragCounter.current = {};
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draggedIndex]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    // 텍스트/이미지 기본 드래그 동작과의 충돌 방지
    e.dataTransfer.effectAllowed = 'move';
    // DataTransfer에 데이터를 실어주어야 Firefox 등 일부 브라우저에서 DnD 작동
    e.dataTransfer.setData('text/plain', index.toString());
    
    // 현재 포커스되어 있는 엘리먼트 해제 (입력 중이던 input 등의 blur)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setDraggedIndex(index);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current[index] = (dragCounter.current[index] || 0) + 1;
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback((index: number) => {
    dragCounter.current[index] = (dragCounter.current[index] || 0) - 1;
    // 카운터가 0이 되었을 때만 over 상태 해제 (자식 요소를 지날 때의 Flicker 가드)
    if (dragCounter.current[index] <= 0) {
      dragCounter.current[index] = 0;
      if (dragOverIndex === index) {
        setDragOverIndex(null);
      }
    }
  }, [dragOverIndex]);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    dragCounter.current = {};

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...items];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    onReorder(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, items, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = {};
  }, []);

  return {
    draggedIndex,
    dragOverIndex,
    bindDragSource: (index: number) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
      onDragEnd: handleDragEnd,
    }),
    bindDropTarget: (index: number) => ({
      onDragOver: (e: React.DragEvent) => e.preventDefault(), // Drop 허용을 위한 필수
      onDragEnter: (e: React.DragEvent) => handleDragEnter(e, index),
      onDragLeave: () => handleDragLeave(index),
      onDrop: (e: React.DragEvent) => handleDrop(e, index),
    }),
  };
}