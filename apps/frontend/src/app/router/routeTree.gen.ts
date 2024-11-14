/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router';

// Import Routes

import { Route as rootRoute } from './../../page/__root';

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')();
const mainRouteLazyImport = createFileRoute('/(main)')();
const IndexLazyImport = createFileRoute('/')();
const mainUserIndexLazyImport = createFileRoute('/(main)/user/')();
const mainLotusIndexLazyImport = createFileRoute('/(main)/lotus/')();
const mainLotusCreateIndexLazyImport = createFileRoute('/(main)/lotus/create/')();
const mainLotusLotusIdIndexLazyImport = createFileRoute('/(main)/lotus/$lotusId/')();

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute
} as any).lazy(() => import('./../../page/about.lazy').then((d) => d.Route));

const mainRouteLazyRoute = mainRouteLazyImport
  .update({
    id: '/(main)',
    path: '/',
    getParentRoute: () => rootRoute
  } as any)
  .lazy(() => import('./../../page/(main)/route.lazy').then((d) => d.Route));

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute
} as any).lazy(() => import('./../../page/index.lazy').then((d) => d.Route));

const mainUserIndexLazyRoute = mainUserIndexLazyImport
  .update({
    id: '/user/',
    path: '/user/',
    getParentRoute: () => mainRouteLazyRoute
  } as any)
  .lazy(() => import('./../../page/(main)/user/index.lazy').then((d) => d.Route));

const mainLotusIndexLazyRoute = mainLotusIndexLazyImport
  .update({
    id: '/lotus/',
    path: '/lotus/',
    getParentRoute: () => mainRouteLazyRoute
  } as any)
  .lazy(() => import('./../../page/(main)/lotus/index.lazy').then((d) => d.Route));

const mainLotusCreateIndexLazyRoute = mainLotusCreateIndexLazyImport
  .update({
    id: '/lotus/create/',
    path: '/lotus/create/',
    getParentRoute: () => mainRouteLazyRoute
  } as any)
  .lazy(() => import('./../../page/(main)/lotus/create/index.lazy').then((d) => d.Route));

const mainLotusLotusIdIndexLazyRoute = mainLotusLotusIdIndexLazyImport
  .update({
    id: '/lotus/$lotusId/',
    path: '/lotus/$lotusId/',
    getParentRoute: () => mainRouteLazyRoute
  } as any)
  .lazy(() => import('./../../page/(main)/lotus/$lotusId/index.lazy').then((d) => d.Route));

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexLazyImport;
      parentRoute: typeof rootRoute;
    };
    '/(main)': {
      id: '/(main)';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof mainRouteLazyImport;
      parentRoute: typeof rootRoute;
    };
    '/about': {
      id: '/about';
      path: '/about';
      fullPath: '/about';
      preLoaderRoute: typeof AboutLazyImport;
      parentRoute: typeof rootRoute;
    };
    '/(main)/lotus/': {
      id: '/(main)/lotus/';
      path: '/lotus';
      fullPath: '/lotus';
      preLoaderRoute: typeof mainLotusIndexLazyImport;
      parentRoute: typeof mainRouteLazyImport;
    };
    '/(main)/user/': {
      id: '/(main)/user/';
      path: '/user';
      fullPath: '/user';
      preLoaderRoute: typeof mainUserIndexLazyImport;
      parentRoute: typeof mainRouteLazyImport;
    };
    '/(main)/lotus/$lotusId/': {
      id: '/(main)/lotus/$lotusId/';
      path: '/lotus/$lotusId';
      fullPath: '/lotus/$lotusId';
      preLoaderRoute: typeof mainLotusLotusIdIndexLazyImport;
      parentRoute: typeof mainRouteLazyImport;
    };
    '/(main)/lotus/create/': {
      id: '/(main)/lotus/create/';
      path: '/lotus/create';
      fullPath: '/lotus/create';
      preLoaderRoute: typeof mainLotusCreateIndexLazyImport;
      parentRoute: typeof mainRouteLazyImport;
    };
  }
}

// Create and export the route tree

interface mainRouteLazyRouteChildren {
  mainLotusIndexLazyRoute: typeof mainLotusIndexLazyRoute;
  mainUserIndexLazyRoute: typeof mainUserIndexLazyRoute;
  mainLotusLotusIdIndexLazyRoute: typeof mainLotusLotusIdIndexLazyRoute;
  mainLotusCreateIndexLazyRoute: typeof mainLotusCreateIndexLazyRoute;
}

const mainRouteLazyRouteChildren: mainRouteLazyRouteChildren = {
  mainLotusIndexLazyRoute: mainLotusIndexLazyRoute,
  mainUserIndexLazyRoute: mainUserIndexLazyRoute,
  mainLotusLotusIdIndexLazyRoute: mainLotusLotusIdIndexLazyRoute,
  mainLotusCreateIndexLazyRoute: mainLotusCreateIndexLazyRoute
};

const mainRouteLazyRouteWithChildren = mainRouteLazyRoute._addFileChildren(mainRouteLazyRouteChildren);

export interface FileRoutesByFullPath {
  '/': typeof mainRouteLazyRouteWithChildren;
  '/about': typeof AboutLazyRoute;
  '/lotus': typeof mainLotusIndexLazyRoute;
  '/user': typeof mainUserIndexLazyRoute;
  '/lotus/$lotusId': typeof mainLotusLotusIdIndexLazyRoute;
  '/lotus/create': typeof mainLotusCreateIndexLazyRoute;
}

export interface FileRoutesByTo {
  '/': typeof mainRouteLazyRouteWithChildren;
  '/about': typeof AboutLazyRoute;
  '/lotus': typeof mainLotusIndexLazyRoute;
  '/user': typeof mainUserIndexLazyRoute;
  '/lotus/$lotusId': typeof mainLotusLotusIdIndexLazyRoute;
  '/lotus/create': typeof mainLotusCreateIndexLazyRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexLazyRoute;
  '/(main)': typeof mainRouteLazyRouteWithChildren;
  '/about': typeof AboutLazyRoute;
  '/(main)/lotus/': typeof mainLotusIndexLazyRoute;
  '/(main)/user/': typeof mainUserIndexLazyRoute;
  '/(main)/lotus/$lotusId/': typeof mainLotusLotusIdIndexLazyRoute;
  '/(main)/lotus/create/': typeof mainLotusCreateIndexLazyRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/about' | '/lotus' | '/user' | '/lotus/$lotusId' | '/lotus/create';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/about' | '/lotus' | '/user' | '/lotus/$lotusId' | '/lotus/create';
  id:
    | '__root__'
    | '/'
    | '/(main)'
    | '/about'
    | '/(main)/lotus/'
    | '/(main)/user/'
    | '/(main)/lotus/$lotusId/'
    | '/(main)/lotus/create/';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute;
  mainRouteLazyRoute: typeof mainRouteLazyRouteWithChildren;
  AboutLazyRoute: typeof AboutLazyRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  mainRouteLazyRoute: mainRouteLazyRouteWithChildren,
  AboutLazyRoute: AboutLazyRoute
};

export const routeTree = rootRoute._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/(main)",
        "/about"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/(main)": {
      "filePath": "(main)/route.lazy.tsx",
      "children": [
        "/(main)/lotus/",
        "/(main)/user/",
        "/(main)/lotus/$lotusId/",
        "/(main)/lotus/create/"
      ]
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/(main)/lotus/": {
      "filePath": "(main)/lotus/index.lazy.tsx",
      "parent": "/(main)"
    },
    "/(main)/user/": {
      "filePath": "(main)/user/index.lazy.tsx",
      "parent": "/(main)"
    },
    "/(main)/lotus/$lotusId/": {
      "filePath": "(main)/lotus/$lotusId/index.lazy.tsx",
      "parent": "/(main)"
    },
    "/(main)/lotus/create/": {
      "filePath": "(main)/lotus/create/index.lazy.tsx",
      "parent": "/(main)"
    }
  }
}
ROUTE_MANIFEST_END */
