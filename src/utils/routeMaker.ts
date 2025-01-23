import { routeConfig } from '@/config/routeConfig';

export type TPageRoutes = { href: string; text: string }[];

export interface IRouteMetadata {
  title: string;
  breadcrumb?: string;
  path?: string;
}

interface BreadcrumbResult {
  title: string;
  pageRoutes: TPageRoutes;
}

const replaceColonBySpaceWithCapitalize = (test: string): string => {
  return test.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export function findRouteMetadata(
  path: string,
  routes: IRouteMetadata[]
): IRouteMetadata | undefined {
  return routes.find((route) => route.path === path);
}

export default function generateBreadcrumbs(
  path: string,
  routeMetadata?: IRouteMetadata
): BreadcrumbResult {
  // Remove any query parameters, as those aren't included in breadcrumbs
  const asPathWithoutQuery = path.split('?')[0];

  // Break down the path between "/"s, removing empty entities
  const asPathNestedRoutes = asPathWithoutQuery
    .split('/')
    .filter((v) => v.length > 0);

  // Iterate over the list of nested route parts and build
  // a "crumb" object for each one.
  const crumbList = asPathNestedRoutes.map((subpath, idx) => {
    const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`;
    // Use route metadata breadcrumb if available, otherwise fallback to formatted path
    const text =
      routeMetadata?.breadcrumb || replaceColonBySpaceWithCapitalize(subpath);
    return { href, text };
  });

  // Add in a default dashboard crumb if crumbList has only 1 link
  const updateCrumbList = [
    { href: routeConfig.dashboard.path(), text: 'Dashboard' },
    ...crumbList,
  ];

  // Handle special cases for info and edit paths
  if (crumbList[1]?.text.toLowerCase() === 'info') {
    const lastCrumb = crumbList[crumbList.length - 1];
    crumbList[1].text = 'Information';
    crumbList[1].href = lastCrumb.href;
  }

  if (crumbList[1]?.text.toLowerCase() === 'edit') {
    const lastCrumb = crumbList[crumbList.length - 1];
    crumbList[1].text = 'Edit';
    crumbList[1].href = lastCrumb.href;
  }

  return {
    title: routeMetadata?.title || crumbList[0]?.text || 'Dashboard',
    pageRoutes: updateCrumbList,
  };
}
