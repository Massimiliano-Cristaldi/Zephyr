import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChatTypeContext, ContactListRefContext, IsMobileContext } from "../utils.tsx";
import "../css/Sidebar.css";
import { UseStateArray } from "../types.ts";

export default function Sidebar(){

    const navigate = useNavigate();
    const isMobile = useContext(IsMobileContext);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext);

    function changeChatType(){
        if (chatType === "individualChat") {
            setChatType("groupChat")
        } else if (chatType === "groupChat"){
            setChatType("individualChat")
        }
        navigate("/", {replace: true});
    }

    function backToContacts(){
        contactListRef.current.style.display = "block";
        backButtonRef.current.style.visibility = "hidden";
        if (isMobile){
            chatWrapperRef.current.style.display = "none";
        }
        navigate("/", {replace: true});
    }

    return(
        <div id="sidebarWrapper">
            <i className="fa-solid fa-inbox" style={{color: "white"}}/>
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