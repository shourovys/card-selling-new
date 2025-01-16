import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/useMenu';
import { MenuItem } from '@/types/navigation';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  items: MenuItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const { menuState, toggleExpanded, toggleMenuItem } = useMenu();

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = menuState.openItems.includes(item.id);

    return (
      <div key={item.id} className="w-full">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between px-4 hover:bg-accent hover:text-accent-foreground',
            'transition-all duration-300 ease-in-out',
            level > 0 && 'pl-8',
            !menuState.expanded && 'px-2'
          )}
          onClick={() => hasChildren && toggleMenuItem(item.id)}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            {menuState.expanded && <span>{item.label}</span>}
          </span>
          {hasChildren && menuState.expanded && (
            <span className="ml-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </Button>
        {hasChildren && isOpen && menuState.expanded && (
          <div className="ml-4 border-l">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'h-screen bg-background border-r flex flex-col transition-all duration-300 ease-in-out',
        menuState.expanded ? 'w-64' : 'w-16'
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {menuState.expanded && <span className="font-semibold">Dashboard</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpanded}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">{items.map((item) => renderMenuItem(item))}</nav>
      </ScrollArea>
    </div>
  );
}