import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import AwaitContact from './components/Chat/AwaitContact';
import SelectedContact from './components/Chat/SelectedContact';
import SelectedGroup from './components/Groupchat/SelectedGroup';
import EditForm from './components/EditThemes/EditForm';
import GroupDetails from './components/Groupchat/GroupDetails';
import AddParticipant from './components/Groupchat/AddParticipant';
import GenericErrorPage from './components/GenericErrorPage';
import ChatErrorPage from './components/Chat/ChatErrorPage';
import './css/index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <GenericErrorPage/>,
        children: [
            {
                path: "/",
                element: <AwaitContact/>,
            },
            {
                path: "chat/:contactId",
                element: <SelectedContact/>,
                errorElement: <ChatErrorPage/>
            },
            {
                path: "groupchat/:groupId",
                element: <SelectedGroup/>,
                errorElement: <ChatErrorPage/>,
                children: [
                    {
                        path: "",
                        element: <GroupDetails/>
                    },
                    {
                        path: "add",
                        element: <AddParticipant/>
                    },
                ]
            },
            {
                path: "themes/edit",
                element: <EditForm/>
            }
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
