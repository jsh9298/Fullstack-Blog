import { useEffect } from "react";
import { ItemSchema } from "../types/builder";

/**
 * 자식 컴포넌트들의 크기, 위치, 회전(rotate)을 실시간으로 감지하여
 * 부모 컨테이너가 잘리지 않고 공간을 확보하도록 최소 크기(minWidth/minHeight)를 늘려주는 훅
 */
export function useAutoExpandParent(parentId: string | null, items: ItemSchema[] | undefined) {
  useEffect(() => {
    if (!parentId) return;

    const parentEl = document.querySelector(`[data-item-id="${parentId}"]`) as HTMLElement;
    if (!parentEl) return;

    const updateParentBounds = () => {
      // 해당 부모 직속 자식들의 DOM 요소를 모두 가져옴
      const childElements = parentEl.querySelectorAll(`:scope > [data-item-id]`) as NodeListOf<HTMLElement>;


      if (childElements.length === 0) return;

      let maxRight = 0;
      let maxBottom = 0;
      let marginX = 0;
      let marginY = 0;
      childElements.forEach((child) => {
        const offsetLeft = child.offsetLeft;
        const offsetTop = child.offsetTop;
        const offsetWidth = child.offsetWidth;
        const offsetHeight = child.offsetHeight;
        const rectHeight = child.getBoundingClientRect().height;
        const rectWidth = child.getBoundingClientRect().width;
        marginX = parseFloat(child.style.marginLeft);
        marginY = parseFloat(child.style.marginTop);
        // 회전 각도나 스타일 데이터가 있다면 반영
        // (회전 시 외곽선이 커지는 보정값 혹은 단순 바운딩 우측/하단 좌표 측정)
        const right = offsetLeft + offsetWidth +rectWidth ;
        const bottom = offsetTop + offsetHeight + rectHeight;
  
        if (right > maxRight) maxRight = right;
        if (bottom > maxBottom) maxBottom = bottom;
      });

      // 여유 공간(Padding) 50px 정도를 더해 부모 크기 동적 확장
      parentEl.style.minWidth = `${maxRight + marginX + parseFloat(parentEl.style.paddingRight)}px`;
      parentEl.style.minHeight = `${maxBottom + marginY + parseFloat(parentEl.style.paddingBottom)}px`;
    };

    // 아이템 상태가 변하거나 리사이즈될 때 실행
    updateParentBounds();
    window.addEventListener("resize", updateParentBounds);

    return () => {
      window.removeEventListener("resize", updateParentBounds);
    };
  }, [parentId, items]);
}