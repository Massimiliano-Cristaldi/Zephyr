import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import AwaitContact from './components/Chat/AwaitContact';
import SelectedContact, {loader as contactLoader} from './components/Chat/SelectedContact';
import { loader as contactListLoader } from './components/Chat/Body';
import EditForm from './components/EditThemes/EditForm';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    loader: contactListLoader,
    children: [
      {
        path: "/",
        element: <AwaitContact/>
      },
      {
        path: "chat/:authId/:contactId",
        element: <SelectedContact/>,
        loader: contactLoader
      },
    ],
  },
  {
    path: "themes/edit",
    element: <EditForm/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
