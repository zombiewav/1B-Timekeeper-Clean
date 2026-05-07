import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { StudentPage } from './components/StudentPage';
import { AdminPage } from './components/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: StudentPage },
      { path: 'admin', Component: AdminPage },
    ],
  },
]);
