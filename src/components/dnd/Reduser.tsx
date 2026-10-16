import {
  insertItemToTree,
  removeItemFromTree,
  updateItemInTree,
} from "@/src/utils/tree";
import { ItemSchema, PrimitiveType, } from "@/src/types/builder";
export interface BuilderState {
  tree: ItemSchema[];
  selectedId: string | null;
  history: ItemSchema[][];
  historyIndex: number;
}

export type BuilderAction =
  | { type: "SELECT_ITEM"; payload: string | null }
  | {
      type: "ADD_ITEM";
      payload: {
        newItem: ItemSchema;
        parentId: string | null;
        index?: number;
      };
    }
  | {
      type: "MOVE_ITEM";
      payload: {
        activeId: string;
        targetParentId: string | null;
        index?: number;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_PROPS"; payload: { id: string; props: Record<string, any> } }
  | { type: "UNDO" }
  | { type: "REDO" };

export function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  const { tree, history, historyIndex } = state;

  // 히스토리에 새 상태 기록 헬퍼
  const pushState = (newTree: ItemSchema[], nextSelectedId?: string | null): BuilderState => {
    const nextHistory = history.slice(0, historyIndex + 1);
    return {
      tree: newTree,
      selectedId: nextSelectedId !== undefined ? nextSelectedId : state.selectedId,
      history: [...nextHistory, newTree],
      historyIndex: nextHistory.length,
    };
  };

  switch (action.type) {
    case "SELECT_ITEM":
      return { ...state, selectedId: action.payload };

    case "ADD_ITEM": {
      const { newItem, parentId, index } = action.payload;
      const newTree = insertItemToTree(tree, parentId, newItem, index);
      return pushState(newTree, newItem.id);
    }

    case "MOVE_ITEM": {
      const { activeId, targetParentId, index } = action.payload;
      const { newTree: treeAfterRemove, removedItem } = removeItemFromTree(tree, activeId);
      if (!removedItem) return state;

      const finalTree = insertItemToTree(treeAfterRemove, targetParentId, removedItem, index);
      return pushState(finalTree, activeId);
    }

    case "REMOVE_ITEM": {
      const { newTree } = removeItemFromTree(tree, action.payload);
      return pushState(newTree, null);
    }

    case "UPDATE_PROPS": {
      const newTree = updateItemInTree(tree, action.payload.id, action.payload.props);
      return pushState(newTree);
    }

    case "UNDO": {
      if (historyIndex <= 0) return state;
      const prevIndex = historyIndex - 1;
      return {
        ...state,
        tree: history[prevIndex],
        historyIndex: prevIndex,
      };
    }

    case "REDO": {
      if (historyIndex >= history.length - 1) return state;
      const nextIndex = historyIndex + 1;
      return {
        ...state,
        tree: history[nextIndex],
        historyIndex: nextIndex,
      };
    }

    default:
      return state;
  }
}