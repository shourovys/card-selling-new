import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCallback } from 'react';
import { MenuState } from '@/types/navigation';

const MENU_STATE_KEY = 'dashboard_menu_state';

const initialState: MenuState = {
  expanded: true,
  openItems: [],
};

export function useMenu() {
  const [menuState, setMenuState] = useLocalStorage<MenuState>(
    MENU_STATE_KEY,
    initialState
  );

  const toggleExpanded = useCallback(() => {
    setMenuState((prev) => ({
      ...prev,
      expanded: !prev.expanded,
    }));
  }, [setMenuState]);

  const toggleMenuItem = useCallback(
    (itemId: string) => {
      setMenuState((prev) => {
        const isOpen = prev.openItems.includes(itemId);
        return {
          ...prev,
          openItems: isOpen
            ? prev.openItems.filter((id) => id !== itemId)
            : [...prev.openItems, itemId],
        };
      });
    },
    [setMenuState]
  );

  return {
    menuState,
    toggleExpanded,
    toggleMenuItem,
  };
}