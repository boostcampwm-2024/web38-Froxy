import * as React from 'react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent
});

function RootComponent() {
  return (
    <React.Fragment>
      <div>Hello "__root"!</div>
      <Link to={'/about'}>about</Link>
      <Link to={'/lotus'}>lotus</Link>
      <Outlet />
    </React.Fragment>
  );
}
