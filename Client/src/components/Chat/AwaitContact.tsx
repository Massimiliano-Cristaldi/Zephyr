import { useContext, useEffect, useState } from "react";
import { ChatTypeContext, ContactListRefContext, IsMobileContext } from "../../utils.tsx";
import "../../css/AwaitContact.css";
import { UseStateArray } from "../../types.ts";

export default function AwaitContact(){

    const isMobile = useContext(IsMobileContext);
    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext).state;
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const [awaitMessage, setAwaitMessage] = useState<string>("Select a contact from the left panel to begin chatting");

    useEffect(()=>{
        if (isMobile) {
            chatWrapperRef.current.style.display = "none";
        } else {
            chatWrapperRef.current.style.display = "block";
        }
    }, [isMobile])

    useEffect(()=>{
        if (chatType !== "individualChat"){
            setAwaitMessage("Select a contact from the left panel to begin chatting");
        } else {
            setAwaitMessage("Select a group from the left panel to begin chatting");
        }
    }, [chatType])

    return(
        <div id="awaitContact">
            <i className="fa-solid fa-chalkboard-user"/>
            {awaitMessage}
        </div>
    )
}