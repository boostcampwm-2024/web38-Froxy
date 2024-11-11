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

const LotusLazyImport = createFileRoute('/lotus')();
const AboutLazyImport = createFileRoute('/about')();

// Create/Update Routes

const LotusLazyRoute = LotusLazyImport.update({
  id: '/lotus',
  path: '/lotus',
  getParentRoute: () => rootRoute
} as any).lazy(() => import('./../../page/lotus.lazy').then((d) => d.Route));

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute
} as any).lazy(() => import('./../../page/about.lazy').then((d) => d.Route));

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/about': {
      id: '/about';
      path: '/about';
      fullPath: '/about';
      preLoaderRoute: typeof AboutLazyImport;
      parentRoute: typeof rootRoute;
    };
    '/lotus': {
      id: '/lotus';
      path: '/lotus';
      fullPath: '/lotus';
      preLoaderRoute: typeof LotusLazyImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/about': typeof AboutLazyRoute;
  '/lotus': typeof LotusLazyRoute;
}

export interface FileRoutesByTo {
  '/about': typeof AboutLazyRoute;
  '/lotus': typeof LotusLazyRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/about': typeof AboutLazyRoute;
  '/lotus': typeof LotusLazyRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/about' | '/lotus';
  fileRoutesByTo: FileRoutesByTo;
  to: '/about' | '/lotus';
  id: '__root__' | '/about' | '/lotus';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  AboutLazyRoute: typeof AboutLazyRoute;
  LotusLazyRoute: typeof LotusLazyRoute;
}

const rootRouteChildren: RootRouteChildren = {
  AboutLazyRoute: AboutLazyRoute,
  LotusLazyRoute: LotusLazyRoute
};

export const routeTree = rootRoute._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/about",
        "/lotus"
      ]
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/lotus": {
      "filePath": "lotus.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
