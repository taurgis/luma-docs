import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';

import Layout from './components/Layout';
import { routes as pageRoutes } from './src/generated-routes';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: pageRoutes,
  },
];

export default routes;