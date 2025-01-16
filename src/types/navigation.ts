import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path: string;
  children?: MenuItem[];
  permissions?: string[];
}

export interface MenuState {
  expanded: boolean;
  openItems: string[];
}