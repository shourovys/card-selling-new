export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  isExpanded?: boolean;
}

export interface MenuState {
  expanded: boolean;
  activeItem: string | null;
  expandedItems: Set<string>;
}

export interface UseMenuReturn {
  menuState: MenuState;
  toggleMenu: () => void;
  toggleMenuItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
  isItemExpanded: (id: string) => boolean;
}

export type MenuAction =
  | { type: 'TOGGLE_MENU' }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'SET_ACTIVE_ITEM'; payload: string }
  | { type: 'RESTORE_STATE'; payload: Partial<MenuState> };
