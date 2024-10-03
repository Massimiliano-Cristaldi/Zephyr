import { useContext, useEffect } from "react";
import { ContactListRefContext, IsMobileContext } from "../../utils.tsx";
import "../../css/AwaitContact.css";

export default function AwaitContact(){

    const isMobile = useContext(IsMobileContext);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

    useEffect(()=>{
        if (isMobile) {
            chatWrapperRef.current.style.display = "none";
        } else {
            chatWrapperRef.current.style.display = "block";
        }
    }, [isMobile])

    return(
        <div id="awaitContact">
            <i className="fa-solid fa-chalkboard-user"/>
            Select a contact from the left panel to begin chatting
        </div>
    )
}