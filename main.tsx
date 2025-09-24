import { ViteReactSSG } from 'vite-react-ssg';

import { routes } from './src/app/App';
import './src/styles/input.css';

export const createRoot = ViteReactSSG({
  routes,
  // pass your BASE_URL
  basename: import.meta.env.BASE_URL,
});