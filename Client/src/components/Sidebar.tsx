import { useContext } from "react";
import { ChatTypeContext, ContactListRefContext } from "../utils.tsx";
import "../css/Sidebar.css";
import { UseStateArray } from "../types.ts";

export default function Sidebar(){

    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext).state;
    const [backToContacts, changeChatType]: Array<()=>void> = useContext(ChatTypeContext).actions;
    
    return(
        <div id="sidebarWrapper">
            <i className={`fa-solid ${chatType === "individualChat" ? "fa-people-group" : "fa-user"}`} 
            style={{color: "white"}} 
            onClick={changeChatType}
            data-toggle="tooltip"
            title={chatType === "individualChat" ? "Group chats" : "Contacts"}
            />
            <i className="fa-solid fa-angle-left" 
            style={{color: "white"}} 
            id="backButton"
            onClick={backToContacts}
            ref={backButtonRef}
            />
        </div>
    )
}