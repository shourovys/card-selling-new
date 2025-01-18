import { TButtonColor, TButtonSize } from '@/components/atomic/Button';
import { TIcon } from '@/utils/icons';
import React from 'react';

interface IActionButtonBase {
  color?: TButtonColor;
  icon?: TIcon;
  text: string;
  iconClass?: string;
  isLoading?: boolean;
  size?: TButtonSize;
  disabled?: boolean;
}

export interface IActionsButtonWithOnClick extends IActionButtonBase {
  link?: never;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IActionsButtonWithLink extends IActionButtonBase {
  link: string;
  onClick?: never;
}

export type IActionsButton = IActionsButtonWithOnClick | IActionsButtonWithLink;
