import { MenuAction, MenuState, UseMenuReturn } from '@/types/navigation';
import { useEffect, useReducer } from 'react';

const STORAGE_KEY = 'dashboard_menu_state';

const initialState: MenuState = {
  expanded: true,
  activeItem: null,
  expandedItems: new Set(),
};

function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, expanded: !state.expanded };
    case 'TOGGLE_ITEM': {
      const newExpandedItems = new Set(state.expandedItems);
      if (newExpandedItems.has(action.payload)) {
        newExpandedItems.delete(action.payload);
      } else {
        newExpandedItems.add(action.payload);
      }
      return { ...state, expandedItems: newExpandedItems };
    }
    case 'SET_ACTIVE_ITEM':
      return { ...state, activeItem: action.payload };
    case 'RESTORE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function useMenu(): UseMenuReturn {
  const [menuState, dispatch] = useReducer(menuReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({
          type: 'RESTORE_STATE',
          payload: {
            ...parsed,
            expandedItems: new Set(parsed.expandedItems),
          },
        });
      } catch (error) {
        console.error('Failed to parse menu state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      ...menuState,
      expandedItems: Array.from(menuState.expandedItems),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [menuState]);

  return {
    menuState,
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    toggleMenuItem: (id: string) =>
      dispatch({ type: 'TOGGLE_ITEM', payload: id }),
    isItemActive: (id: string) => menuState.activeItem === id,
    isItemExpanded: (id: string) => menuState.expandedItems.has(id),
  };
}
