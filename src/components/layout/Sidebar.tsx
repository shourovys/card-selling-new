import { Button } from '@/components/ui/button';
import { useMenu } from '@/hooks/useMenu';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface SidebarProps {
  items: MenuItem[];
  className?: string;
}

interface MenuItemProps extends MenuItem {
  level?: number;
  onSelect?: (id: string) => void;
}

const MenuItemComponent = ({
  id,
  label,
  icon: Icon,
  path,
  children = [],
  level = 0,
  onSelect,
}: MenuItemProps) => {
  const { menuState, toggleMenuItem, isItemActive, isItemExpanded } = useMenu();
  const expanded = isItemExpanded(id);
  const active = isItemActive(id);

  const handleClick = useCallback(() => {
    if (children.length) {
      toggleMenuItem(id);
    }
    if (path) {
      window.location.href = path;
    }
    onSelect?.(id);
  }, [children.length, id, onSelect, path, toggleMenuItem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div className='w-full'>
      <div
        role='button'
        tabIndex={0}
        className={cn(
          'flex items-center w-full px-3 py-2 transition-colors duration-300',
          'hover:bg-accent/50 rounded-lg cursor-pointer',
          active && 'bg-accent',
          level > 0 && 'ml-4'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {Icon && <span className='mr-2 w-4 h-4'>{Icon}</span>}
        <span
          className={cn(
            'flex-grow transition-all duration-300',
            !menuState.expanded && 'opacity-0 w-0'
          )}
        >
          {label}
        </span>
        {children.length > 0 && menuState.expanded && (
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              expanded && 'transform rotate-180'
            )}
          />
        )}
      </div>
      {children.length > 0 && expanded && menuState.expanded && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            'transform origin-top',
            expanded ? 'scale-y-100' : 'scale-y-0'
          )}
        >
          {children.map((item) => (
            <MenuItemComponent
              key={item.id}
              {...item}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function Sidebar({ items, className }: SidebarProps) {
  const { menuState, toggleMenu } = useMenu();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMenu]);

  return (
    <div
      className={cn(
        'flex flex-col h-full border-r transition-all duration-300',
        menuState.expanded ? 'w-64' : 'w-16',
        className
      )}
    >
      <div className='flex items-center px-4 h-16'>
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleMenu}
          className='hover:bg-accent/50'
        >
          <Menu className='w-5 h-5' />
        </Button>
      </div>
      <nav className='overflow-y-auto flex-1'>
        {items.map((item) => (
          <MenuItemComponent key={item.id} {...item} />
        ))}
      </nav>
    </div>
  );
}
