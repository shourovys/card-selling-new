import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { menuItems, type MenuItem } from '@/config/menu';
import { hasAnyPermission } from '@/config/permission';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, LogOut, Menu, User } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  expanded?: boolean;
  organizationName?: string;
  organizationType?: string;
  onToggle?: () => void;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, expanded = true, onToggle }) => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const [openGroups, setOpenGroups] = React.useState<string[]>([]);

    const { user, logout } = useAuth();

    const isActiveRoute = useCallback(
      (path?: string) => {
        if (!path) return false;
        return location.pathname === path;
      },
      [location.pathname]
    );

    const hasActiveChild = useCallback(
      (item: MenuItem): boolean => {
        if (item.path && isActiveRoute(item.path())) return true;
        if (item.subMenu) {
          return item.subMenu.some((subItem) => hasActiveChild(subItem));
        }
        return false;
      },
      [isActiveRoute]
    );

    const toggleGroup = useCallback((label: string) => {
      setOpenGroups((prev) =>
        prev.includes(label)
          ? prev.filter((t) => t !== label)
          : [...prev, label]
      );
    }, []);

    const hasPermissionForItem = useCallback(
      (item: MenuItem): boolean => {
        if (!user?.permissions || !item.requiredPermissions?.length)
          return true;
        return hasAnyPermission(user.permissions, item.requiredPermissions);
      },
      [user?.permissions]
    );

    const hasPermissionForAnyChild = useCallback(
      (item: MenuItem): boolean => {
        if (!item.subMenu) return hasPermissionForItem(item);
        return item.subMenu.some((subItem) => hasPermissionForItem(subItem));
      },
      [hasPermissionForItem]
    );

    const MenuLink = React.memo(
      ({
        item,
        isSubmenu = false,
        onClick,
      }: {
        item: MenuItem;
        isSubmenu?: boolean;
        onClick?: () => void;
      }) => {
        if (!item.path || !hasPermissionForItem(item)) return null;
        const Icon = item.icon;

        return (
          <Link
            to={item.path()}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              isActiveRoute(item.path())
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              expanded && isSubmenu && 'ml-5',
              !expanded && !isSubmenu && 'justify-center'
            )}
            onClick={() => {
              onClick?.();
              setIsMobileOpen(false);
            }}
            title={item.description}
            role='menuitem'
          >
            <Icon
              className={cn('size-5', !expanded && !isSubmenu && 'size-7')}
              aria-hidden='true'
            />
            <span className={cn(!expanded && !isSubmenu && 'hidden')}>
              {item.title}
            </span>
          </Link>
        );
      }
    );

    const MenuGroup = React.memo(({ item }: { item: MenuItem }) => {
      const isOpen = openGroups.includes(item.title);
      const isActive = hasActiveChild(item);
      const Icon = item.icon;

      if (!hasPermissionForAnyChild(item)) return null;

      if (!item.subMenu) {
        return <MenuLink item={item} />;
      }

      if (!expanded) {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  'flex justify-center items-center p-2 w-full rounded-lg transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
                title={item.description}
                aria-label={item.title}
              >
                <Icon className='size-7' aria-hidden='true' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side='right'
              className='p-1 w-56'
              align='start'
              alignOffset={-4}
            >
              <div
                className='flex flex-col gap-1'
                role='menu'
                aria-label={`${item.title} submenu`}
              >
                {item.subMenu
                  .filter((subItem) => hasPermissionForItem(subItem))
                  .map((subItem) => (
                    <MenuLink key={subItem.title} item={subItem} isSubmenu />
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      }

      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleGroup(item.title)}>
          <CollapsibleTrigger
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
            title={item.description}
          >
            <div className='flex gap-3 items-center'>
              <Icon className='w-5 h-5' aria-hidden='true' />
              <span>{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                isOpen && 'rotate-180'
              )}
              aria-hidden='true'
            />
          </CollapsibleTrigger>
          <CollapsibleContent className='py-2'>
            <div role='menu' aria-label={`${item.title} submenu`}>
              {item.subMenu
                .filter((subItem) => hasPermissionForItem(subItem))
                .map((subItem) => (
                  <MenuLink key={subItem.title} item={subItem} isSubmenu />
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    });

    const OrganizationHeader = React.memo(() => (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-4',
          !expanded && 'justify-center'
        )}
      >
        <div className='flex justify-center items-center rounded-lg bg-background'>
          <img src='/logo/full_logo.svg' alt='Logo' className='w-full h-8' />
        </div>
      </div>
    ));

    const UserSection = React.memo(() => {
      const UserActions = () => (
        <div className='flex flex-col gap-1 p-1'>
          <Button
            variant='ghost'
            className='flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-destructive'
            onClick={logout}
          >
            <LogOut className='w-5 h-5' aria-hidden='true' />
            Log out
          </Button>
        </div>
      );

      if (!expanded) {
        return (
          <div className='px-3 py-4 mt-auto border-t'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className='justify-center px-2 py-3 w-full h-auto'
                  aria-label='User menu'
                >
                  <div className='flex justify-center items-center w-10 h-10 rounded-full bg-primary/10 text-primary'>
                    <User className='size-6' aria-hidden='true' />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side='right'
                className='p-0 w-56'
                align='start'
                alignOffset={-4}
              >
                <div className='p-2 border-b'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{user?.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {user?.email}
                    </span>
                  </div>
                </div>
                <UserActions />
              </PopoverContent>
            </Popover>
          </div>
        );
      }

      return (
        <div className='px-3 py-4 mt-auto border-t'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='justify-start px-2 py-3 w-full h-auto'
                aria-label='User menu'
              >
                <div className='flex gap-3 items-center'>
                  <div className='flex justify-center items-center w-10 h-10 rounded-full bg-primary/10 text-primary'>
                    <User className='size-6' aria-hidden='true' />
                  </div>
                  <div className='flex flex-col items-start text-left'>
                    <span className='text-sm font-medium'>{user?.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {user?.email}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <UserActions />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    });

    const MobileNav = React.memo(() => {
      return (
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='px-0 mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
              aria-label='Open menu'
            >
              <Menu className='w-6 h-6' aria-hidden='true' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0'>
            <div className='flex flex-col h-full'>
              <OrganizationHeader />
              <div className='overflow-auto flex-1 px-3'>
                <SidebarContent />
              </div>
              <UserSection />
            </div>
          </SheetContent>
        </Sheet>
      );
    });

    const SidebarContent = React.memo(() => {
      const filteredMenuItems = useMemo(
        () =>
          menuItems.filter(
            (item) => !item.isHidden && hasPermissionForAnyChild(item)
          ),
        [hasPermissionForAnyChild]
      );

      return (
        <div className='flex flex-col gap-1'>
          <nav
            className='flex flex-col gap-1 space-y-2'
            role='navigation'
            aria-label='Main'
          >
            {filteredMenuItems.map((item) => (
              <MenuGroup key={item.title} item={item} />
            ))}
          </nav>
        </div>
      );
    });

    return (
      <>
        <MobileNav />
        <aside
          className={cn(
            'hidden fixed top-0 left-0 z-40 h-screen border-r backdrop-blur-xl bg-background/80 lg:block',
            expanded ? 'w-64' : 'w-18',
            className
          )}
          role='complementary'
          aria-label='Sidebar'
        >
          <div className='flex flex-col h-full'>
            <div
              className={cn(
                'flex items-center justify-between h-24 px-3 py-2',
                !expanded && 'justify-center'
              )}
            >
              {expanded && <OrganizationHeader />}
              <Button
                variant='ghost'
                size='icon'
                className='size-9'
                onClick={onToggle}
                aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <ChevronLeft
                  className={cn(
                    'size-6 transition-transform',
                    !expanded && 'rotate-180'
                  )}
                  aria-hidden='true'
                />
              </Button>
            </div>
            <div className='overflow-auto flex-1 px-3'>
              <SidebarContent />
            </div>
            <UserSection />
          </div>
        </aside>
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';
