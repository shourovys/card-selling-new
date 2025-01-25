import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';

export interface ActionItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'ghost'
    | 'outline'
    | 'secondary'
    | 'link';
  className?: string;
}

interface IProps {
  selected?: boolean;
  actions: ActionItem[];
  className?: string;
}

function TableDataAction({ selected, actions, className }: IProps) {
  const visibleActions = actions.slice(
    0,
    actions.length <= 2 ? actions.length : 1
  );
  const dropdownActions = actions.slice(
    actions.length <= 2 ? actions.length : 1
  );

  return (
    <td
      className={cn(
        'custom_transition sticky left-0 bg-white text-sm text-center text-gray-700 whitespace-nowrap group-hover:bg-[#F9FAFB]',
        selected && 'bg-[#F9FAFB]',
        className
      )}
    >
      <TooltipProvider>
        <div className='flex gap-1 justify-start items-center'>
          {visibleActions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  size='icon'
                  className={cn(
                    'w-8 h-8 ',
                    action.variant === 'destructive'
                      ? 'text-destructive hover:text-destructive'
                      : 'text-gray-500 hover:text-gray-500',
                    action.className
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    action.onClick();
                  }}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {dropdownActions.length > 0 && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='w-8 h-8 hover:bg-gray-100'
                    >
                      <span className='sr-only'>Open menu</span>
                      <MoreVertical className='w-4 h-4 text-gray-500' />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More actions</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align='end' className='w-[160px]'>
                {dropdownActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={(event) => {
                      event.stopPropagation();
                      action.onClick();
                    }}
                    className={cn(
                      'text-sm flex items-center gap-3',
                      action.variant === 'destructive' &&
                        'text-destructive hover:text-destructive focus:text-destructive',
                      action.className
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TooltipProvider>
    </td>
  );
}

export default TableDataAction;
