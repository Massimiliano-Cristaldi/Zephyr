import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import AwaitContact from './components/Chat/AwaitContact';
import SelectedContact from './components/Chat/SelectedContact';
import EditForm from './components/EditThemes/EditForm';
import './css/index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <AwaitContact/>
      },
      {
        path: "chat/:authId/:contactId",
        element: <SelectedContact/>,
      },
      {
        path: "themes/edit",
        element: <EditForm/>
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
