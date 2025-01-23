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
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, LogOut, Menu, User } from 'lucide-react';
import React from 'react';
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

    const isActiveRoute = (path?: string) => {
      if (!path) return false;
      return location.pathname === path;
    };

    const hasActiveChild = (item: MenuItem): boolean => {
      if (item.path && isActiveRoute(item.path())) return true;
      if (item.subMenu) {
        return item.subMenu.some((subItem) => hasActiveChild(subItem));
      }
      return false;
    };

    const toggleGroup = (label: string) => {
      setOpenGroups((prev) =>
        prev.includes(label)
          ? prev.filter((t) => t !== label)
          : [...prev, label]
      );
    };

    const MenuLink = ({
      item,
      isSubmenu = false,
      onClick,
    }: {
      item: MenuItem;
      isSubmenu?: boolean;
      onClick?: () => void;
    }) => {
      if (!item.path) return null;
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
        >
          <Icon className={cn('size-5', !expanded && !isSubmenu && 'size-7')} />
          <span className={cn(!expanded && !isSubmenu && 'hidden')}>
            {item.title}
          </span>
        </Link>
      );
    };

    const MenuGroup = ({ item }: { item: MenuItem }) => {
      const isOpen = openGroups.includes(item.title);
      const isActive = hasActiveChild(item);
      const Icon = item.icon;

      if (!item.subMenu) {
        return <MenuLink item={item} />;
      }

      if (!expanded) {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  'w-full flex items-center justify-center rounded-lg p-2 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className='size-7' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side='right'
              className='w-56 p-1'
              align='start'
              alignOffset={-4}
            >
              <div className='flex flex-col gap-1'>
                {item.subMenu.map((subItem) => (
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
          >
            <div className='flex items-center gap-3'>
              <Icon className='h-5 w-5' />
              <span>{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className='py-2'>
            {item.subMenu.map((subItem) => (
              <MenuLink key={subItem.title} item={subItem} isSubmenu />
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    };

    const OrganizationHeader = () => (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-4',
          !expanded && 'justify-center'
        )}
      >
        <div className='flex items-center justify-center rounded-lg bg-background'>
          <img src='/logo/full_logo.svg' alt='Logo' className='h-8 w-full' />
        </div>
      </div>
    );

    const UserSection = () => {
      const UserActions = () => (
        <div className='flex flex-col gap-1 p-1'>
          {/* <Button
            variant='ghost'
            className='flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm'
          >
            <User className='h-5 w-5' />
            Account
          </Button>
          <Button
            variant='ghost'
            className='flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm'
          >
            <Settings className='h-5 w-5' />
            Settings
          </Button> */}
          {/* <DropdownMenuSeparator /> */}
          <Button
            variant='ghost'
            className='flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm text-destructive'
            onClick={logout}
          >
            <LogOut className='h-5 w-5' />
            Log out
          </Button>
        </div>
      );

      if (!expanded) {
        return (
          <div className='mt-auto border-t px-3 py-4'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className='h-auto w-full justify-center px-2 py-3'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    {/* {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='h-10 w-10 rounded-full'
                      />
                    ) : ( */}
                    <User className='size-6' />
                    {/* // )} */}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side='right'
                className='w-56 p-0'
                align='start'
                alignOffset={-4}
              >
                <div className='border-b p-2'>
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
        <div className='mt-auto border-t px-3 py-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-auto w-full justify-start px-2 py-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    {/* {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='h-10 w-10 rounded-full'
                      />
                    ) : ( */}
                    <User className='size-6' />
                    {/* )} */}
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
    };

    const MobileNav = () => {
      return (
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
            >
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0'>
            <div className='flex h-full flex-col'>
              <OrganizationHeader />
              <div className='flex-1 overflow-auto px-3'>
                <SidebarContent />
              </div>
              <UserSection />
            </div>
          </SheetContent>
        </Sheet>
      );
    };

    const SidebarContent = () => {
      return (
        <div className='flex flex-col gap-1'>
          <nav className='flex flex-col gap-1 space-y-2'>
            {menuItems.map((item) => (
              <MenuGroup key={item.title} item={item} />
            ))}
          </nav>
        </div>
      );
    };

    return (
      <>
        <MobileNav />
        <aside
          className={cn(
            'fixed left-0 top-0 z-40 hidden h-screen border-r bg-background/80 backdrop-blur-xl lg:block',
            expanded ? 'w-64' : 'w-18',
            className
          )}
        >
          <div className='flex h-full flex-col'>
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
              >
                <ChevronLeft
                  className={cn(
                    'size-6 transition-transform',
                    !expanded && 'rotate-180'
                  )}
                />
              </Button>
            </div>
            <div className='flex-1 overflow-auto px-3'>
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
