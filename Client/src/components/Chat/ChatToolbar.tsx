import { useContext } from "react";
import { ViewProfileContext } from "../../utils.tsx";
import { ChatToolbarProps } from "../../types";
import "../../css/ChatToolbar.css";

export default function ChatToolbar({contact}: ChatToolbarProps){

    const [viewProfileRef, contactNameRef] = useContext(ViewProfileContext);

    function showViewProfileModal(){
        viewProfileRef.current.style.display = "flex";
    }
    
    return(
            <div id="chatToolbar">
                <div id="contactInfo" onClick={showViewProfileModal}>
                    <div 
                    className="contactIcon" 
                    style={{backgroundImage: `url(/public/${contact?.icon_url || "/user_icons/user.png"}`}}>
                    </div>
                    <div className="d-flex flex-column pb-1" id="nameAndNumber">
                        <div ref={contactNameRef}>
                            {contact.user_added_as || contact.username}
                        </div>
                        <small id="phoneNumber">
                            +39 {contact.phone_number || "Loading"}
                        </small>
                    </div>
                </div>
            </div>
    )
}