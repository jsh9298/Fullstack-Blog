import { ItemSchema, PrimitiveType, } from "../types/builder";
export function insertItemToTree(tree:ItemSchema[],parentId: string | null,newItem: ItemSchema,
  targetIndex?: number):ItemSchema[]{
    if(!parentId){
      const next = [...tree];
      if (typeof targetIndex === "number") {
        next.splice(targetIndex, 0, newItem);
      } else {
        next.push(newItem);
      }
      return next;
    }

    return tree.map((item)=>{
      if(item.id === parentId){
        const currentChildren = item.children || [];
        const nextChildren = [...currentChildren];
        if(typeof targetIndex === "number"){
          nextChildren.splice(targetIndex,0,newItem);
        } else{
          nextChildren.push(newItem);
        }
        return {...item,children:nextChildren};
      }
      if(item.children && item.children.length>0){
        return {
          ...item,
          children: insertItemToTree(item.children,parentId,newItem,targetIndex),
        };
      }
      return item;
    });
}

export function removeItemFromTree(
  tree: ItemSchema[],
  id: string
): { newTree: ItemSchema[]; removedItem: ItemSchema | null } {
  let removedItem: ItemSchema | null = null;

  function filterNode(nodes: ItemSchema[]): ItemSchema[] {
    return nodes.filter((node)=>{
      if(node.id === id){
        removedItem = node;
        return false;
      }
      return true;
    }).map((node) => {
      if(node.children && node.children.length > 0){
        return{
          ...node,
          children:filterNode(node.children),
        };
      }
      return node;
    });
  }
  const newTree = filterNode(tree);
  return {newTree, removedItem};
} 

export function updateItemInTree(
  tree: ItemSchema[],
  id: string,
  newProps: Record<string, any>
): ItemSchema[] {
  return tree.map((item) => {
    if (item.id === id) {
      return { ...item, props: { ...item.props, ...newProps } };
    }
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: updateItemInTree(item.children, id, newProps),
      };
    }
    return item;
  });
}



export function findItemInTree(tree: ItemSchema[],
  id: string
): ItemSchema | null {
  const found = tree.find((item) => item.id === id);
  if (found) return found; // 찾았다면 하위 자식을 보지 않고 즉시 반환(조기 종료)

  // 2. 현재 레벨에 없다면, 자식 노드들 속으로 깊숙이 파고들어 탐색합니다.
  for (const item of tree) {
    if (item.children && item.children.length > 0) {
      const childFound = findItemInTree(item.children, id);
      if (childFound) return childFound; // 자식의 자식 엘리먼트에서 찾았다면 반환
    }
  }

  return null; // 끝내 찾지 못했다면 null 반환
}

export function filterTreeByType(
  tree: ItemSchema[],
  type: PrimitiveType
): ItemSchema[] {
  return tree
    .filter((item) => item.type === type) // 조건에 맞는 노드만 필터링
    .map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterTreeByType(item.children, type), // 자식들도 똑같이 필터링
        };
      }
      return item;
    });
}


export function updateLocalVarsInTree(
  tree: ItemSchema[],
  id: string,
  newLocalVars: Record<string, any>
): ItemSchema[] {
  return tree.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        localVars: {
          ...item.localVars,
          ...newLocalVars,
        },
      };
    }
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: updateLocalVarsInTree(item.children, id, newLocalVars),
      };
    }
    return item;
  });
}