import {
  insertItemToTree,
  removeItemFromTree,
  updateItemInTree,
  updateLocalVarsInTree,
  findItemInTree
} from "@/src/utils/tree";
import { ItemSchema, } from "@/src/types/builder";

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
  | { type: "REDO" } 
  | { type: "UPDATE_LOCAL_VARS";  payload: { id: string; localVars:Record<string, any> }}
  | { type: "COMMIT_HISTORY"}
  | {type: "DUPLICATE_ITEM"; payload: string };

export const MAX_HISTORY_LIMIT = 30;

function pushState(state: BuilderState):BuilderState {
   const { tree, history, historyIndex } = state;

  // 현재 트리 상태가 이전 히스토리 스냅샷과 동일하면 중복 저장 방지
  if (history[historyIndex] && JSON.stringify(history[historyIndex]) === JSON.stringify(tree)) {
    return state;
  }
  // 히스토리에 새 상태 기록 헬퍼
  const slicedHistory = history.slice(0, historyIndex + 1);
    
  const updatedHistory = [...slicedHistory, tree];

    if (updatedHistory.length > MAX_HISTORY_LIMIT) {
      const trimmedHistory = updatedHistory.slice(1);
      return {
        ...state,
        history: trimmedHistory,
        historyIndex: trimmedHistory.length - 1,
      };
    }

    return {
      ...state,
      history: updatedHistory,
      historyIndex: updatedHistory.length - 1,
    };
}

export function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "SELECT_ITEM":
      return { ...state, selectedId: action.payload };

    case "ADD_ITEM": {
      const { newItem, parentId, index } = action.payload;
      const newTree = insertItemToTree(state.tree, parentId, newItem, index);
      return pushState({...state,tree:newTree,selectedId:newItem.id});
    }

    case "MOVE_ITEM": {
      const { activeId, targetParentId, index } = action.payload;
      const { newTree: treeAfterRemove, removedItem } = removeItemFromTree(state.tree, activeId);
      if (!removedItem) return state;

      const finalTree = insertItemToTree(treeAfterRemove, targetParentId, removedItem, index);
      return pushState({...state,tree:finalTree,selectedId:activeId});
    }

    case "REMOVE_ITEM": {
      const { newTree } = removeItemFromTree(state.tree, action.payload);
      return pushState({...state,tree:newTree,selectedId: null});
    }

    case "UPDATE_PROPS": {
      const newTree = updateItemInTree(state.tree, action.payload.id, action.payload.props);
      return { ...state, tree: newTree };
    }
    
    case "UPDATE_LOCAL_VARS" : {
      const newTree = updateLocalVarsInTree(state.tree,action.payload.id,action.payload.localVars);
      return { ...state, tree: newTree };
    }

    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const prevIndex = state.historyIndex - 1;
      return {
        ...state,
        tree: state.history[prevIndex],
        historyIndex: prevIndex,
      };
    }

    case "REDO": {
      if (state.historyIndex >= history.length - 1) return state;
      const nextIndex = state.historyIndex + 1;
      return {
        ...state,
        tree: state.history[nextIndex],
        historyIndex: nextIndex,
      };
    }
    case "COMMIT_HISTORY":
      return pushState(state);

    case "DUPLICATE_ITEM": {
      const targetItem = findItemInTree(state.tree,action.payload);
      if (!targetItem) return state;
      const duplicatedData = JSON.parse(JSON.stringify(targetItem));
      const newItem: ItemSchema = {
        ...duplicatedData,
        id: `${targetItem.type}-DPL-${Date.now()}`,
      };
      const newTree = insertItemToTree(state.tree, action.payload, newItem, state.tree.length);
      return pushState({
        ...state,
        tree: newTree,
        selectedId: newItem.id,
      });
    }
    default:
      return state;
  }
}