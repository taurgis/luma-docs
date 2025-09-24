import type { RouteRecord } from 'vite-react-ssg';

import { routes as pageRoutes } from '../generated-routes';

import Layout from './layout/Layout';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: pageRoutes,
  },
];

export default routes;