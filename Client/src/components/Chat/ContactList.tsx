import { useNavigate } from "react-router-dom";
import { ContactListRefContext, isMobile } from "../../utils";
import { User } from "../../types";
import { useContext } from "react";
interface ContactListProps{
    contactList: User[] | [];
}

export default function ContactList({contactList}: ContactListProps){

    const authId = 1;
    const navigate = useNavigate();
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
                        {contact.username}
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