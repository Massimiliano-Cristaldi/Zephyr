import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import AwaitContact from './components/Chat/AwaitContact';
import SelectedContact from './components/Chat/SelectedContact';
import SelectedGroup from './components/Groupchat/SelectedGroup';
import EditForm from './components/EditThemes/EditForm';
import DragAndDrop from './components/Chat/DragAndDrop';
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
                path: "groupchat/:groupId",
                element: <SelectedGroup/>,
            },
            {
                path: "themes/edit",
                element: <EditForm/>
            },
            {
                path: "dndtest",
                element: <DragAndDrop/>
            }
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <RouterProvider router={router}/>
    </StrictMode>
)
