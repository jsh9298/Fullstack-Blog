import { ItemSchema, PrimitiveType, } from "../types/builder";
import { v4 as uuidv4 } from 'uuid';

const itemCache = new WeakMap<ItemSchema[], Map<string, ItemSchema>>();
const parentCache = new WeakMap<ItemSchema[], Map<string, string | null>>();

function ensureTreeIndex(tree: ItemSchema[]): {
  itemMap: Map<string, ItemSchema>;
  parentMap: Map<string, string | null>;
} {
  if (itemCache.has(tree) && parentCache.has(tree)) {
    return { itemMap: itemCache.get(tree)!, parentMap: parentCache.get(tree)! };
  }

  const itemMap = new Map<string, ItemSchema>();
  const parentMap = new Map<string, string | null>();

  function traverse(nodes: ItemSchema[], parentId: string | null = null) {
    for (const node of nodes) {
      itemMap.set(node.id, node);
      parentMap.set(node.id, parentId);
      if (node.children && node.children.length > 0) {
        traverse(node.children, node.id);
      }
    }
  }
  traverse(tree);

  itemCache.set(tree, itemMap);
  parentCache.set(tree, parentMap);

  return { itemMap, parentMap };
}

export function insertItemToTree(tree: ItemSchema[], parentId: string | null, newItem: ItemSchema,
  targetIndex?: number): ItemSchema[] {
  if (!parentId) {
    const next = [...tree];
    if (typeof targetIndex === "number") {
      next.splice(targetIndex, 0, newItem);
    } else {
      next.push(newItem);
    }
    return next;
  }

  return tree.map((item) => {
    if (item.id === parentId) {
      const currentChildren = item.children || [];
      const nextChildren = [...currentChildren];
      if (typeof targetIndex === "number") {
        nextChildren.splice(targetIndex, 0, newItem);
      } else {
        nextChildren.push(newItem);
      }
      return { ...item, children: nextChildren };
    }
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: insertItemToTree(item.children, parentId, newItem, targetIndex),
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
    return nodes.filter((node) => {
      if (node.id === id) {
        removedItem = node;
        return false;
      }
      return true;
    }).map((node) => {
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: filterNode(node.children),
        };
      }
      return node;
    });
  }
  const newTree = filterNode(tree);
  return { newTree, removedItem };
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


export function findItemInTree(tree: ItemSchema[], id: string): ItemSchema | null {
  const { itemMap } = ensureTreeIndex(tree);
  return itemMap.get(id) || null;
}

export function findParentIdInTree(tree: ItemSchema[], targetId: string | null): string | null {
  if (!targetId) return null;
  const { parentMap } = ensureTreeIndex(tree);
  return parentMap.get(targetId) || null;
}


export function filterTreeByType(
  tree: ItemSchema[],
  type: PrimitiveType
): ItemSchema[] {
  return tree
    .map((item) => {
      const filteredChildren = item.children && item.children.length > 0 ? filterTreeByType(item.children, type) : [];
      return { ...item, children: filteredChildren };
    }).filter((item) => item.type === type || (item.children && item.children.length > 0)) // 조건에 맞는 노드만 필터링;
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



export function cloneItemWithNewIds(tree: ItemSchema[], item: ItemSchema): ItemSchema {
  const newId = generateUniqueId(tree, item.type);
  return {
    ...item,
    id: newId,
    children: item.children
      ? item.children.map((child) => cloneItemWithNewIds(tree, child))
      : undefined,
  };
}

export function insertItemAfterTree(
  tree: ItemSchema[],
  targetId: string,
  newItem: ItemSchema
): ItemSchema[] {
  return tree.reduce((acc: ItemSchema[], item) => {
    if (item.id === targetId) {
      acc.push(item);
      acc.push(newItem);
    } else {
      const copiedItem = { ...item };
      if (copiedItem.children && copiedItem.children.length > 0) {
        copiedItem.children = insertItemAfterTree(copiedItem.children, targetId, newItem);
      }
      acc.push(copiedItem);
    }
    return acc;
  }, []);
}


export function generateUniqueId(tree: ItemSchema[], type: string): string {
  let newId = "";
  do {
    newId = `${type}-${uuidv4()}`;
  } while (findItemInTree(tree, newId) !== null);
  return newId;
}