import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext, ContactListRefContext, isMobile } from "../../utils";
import { User } from "../../types";
import "../../css/ContactList.css";

interface ContactListProps{
    contactList: User[] | [];
}

export default function ContactList({contactList}: ContactListProps){

    const navigate = useNavigate();
    const authId = useContext(AuthUserContext);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

    function openChat(contactId: number){
        if (isMobile()) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        }
        navigate(`/chat/${authId}/${contactId}`, {replace: true});
    }

    return(
        <>
        {contactList ?
            (contactList.map((contact: User)=> contact.id !== authId ? (
                    <div key={contact.id} onClick={()=>openChat(contact.id)}>
                        <div className="contactIcon" style={{backgroundImage: `url(${contact.icon_url || "/user.png"})`}}></div>
                        {contact.user_added_as}
                    </div>
            ) : "")
        ) : (
                <div className="text-center p-5">
                Add contacts to your addess book to begin chatting
                </div>
            )
        }
        </>
    )
}