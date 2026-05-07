import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { StudentPage } from './components/StudentPage';
import { AdminPage } from './components/AdminPage';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { path: 'login', Component: LoginPage },
      { index: true, Component: StudentPage },
      {
        path: 'admin',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <AdminPage /> }],
      },
    ],
  },
]);
