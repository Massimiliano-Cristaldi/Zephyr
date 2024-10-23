import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext, ChatTypeContext, ContactListRefContext, IsMobileContext } from "../../utils.tsx";
import { ContactListProps, UseStateArray } from "../../types";
import "../../css/ContactList.css";

//TODO: Fix the look of the contact list when it's empty
export default function ContactList({contacts, groups}: ContactListProps){

    const navigate = useNavigate();
    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext).state;

    function openChat(chatId: number){
        if (isMobile) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        }
        if (chatType === "individualChat") {
            navigate(`/chat/${chatId}`, {replace: true});
        } else if (chatType === "groupChat"){
            navigate(`/groupchat/${chatId}`, {replace: true});
        }
    }

    return(
        <>
        {contacts.length !== 0 && chatType === "individualChat" &&
            (contacts.map((contact)=> contact.id !== authUser.id && (
                <div key={contact.id} onClick={()=>openChat(contact.id)}>
                    <div className="contactIcon" style={{backgroundImage: `url(/public${contact.icon_url || "/user_icons/user.png"})`}}></div>
                    {contact.user_added_as}
                </div>))
        )}
        {groups.length !== 0 && chatType === "groupChat" &&
            (groups.map((group)=>(
                <div key={group.id} onClick={()=>{openChat(group.id)}}>
                    <div className="contactIcon" style={{backgroundImage: `url(/public${group.icon_url || "/user_icons/user.png"})`}}></div>
                    {group.title}
                </div>))
        )}
        {contacts.length === 0 && groups.length === 0 && (
                <div className="text-center p-5">
                Add contacts to your address book to begin chatting
                </div>
        )}
        </>
    )
}