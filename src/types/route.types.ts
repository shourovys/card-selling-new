import { LucideIcon } from 'lucide-react';
import { IUserRole } from './auth.types';

// Base route metadata interface
export interface RouteMetadataBase {
  path: (id?: string) => string;
  routePath: string;
  title: string;
  roles?: IUserRole[];
  isPublic?: boolean;
}

export interface RouteMetadataMenu extends RouteMetadataBase {
  icon?: LucideIcon;
}

export interface RouteMetadataNonMenu extends RouteMetadataBase {
  icon?: never;
}

export type RouteMetadata = RouteMetadataMenu | RouteMetadataNonMenu;

// Route configuration interface extending metadata
export interface RouteConfig {
  [key: string]: RouteMetadata;
}

// Breadcrumb types
export interface BreadcrumbItem {
  href: string;
  text: string;
}

export interface BreadcrumbResult {
  title: string;
  pageRoutes: BreadcrumbItem[];
}

// Route path helper type
export type RoutePaths = {
  [key: string]: string | ((id: string) => string);
};
