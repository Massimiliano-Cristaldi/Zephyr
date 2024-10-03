import { useContext } from "react";
import { ViewProfileContext } from "../../utils";
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
                    style={{backgroundImage: `url(/${contact?.icon_url || "user.png"}`}}>
                    </div>
                    <div className="d-flex flex-column pb-1" id="nameAndNumber">
                        <div ref={contactNameRef}>
                            {contact.user_added_as}
                        </div>
                        <small id="phoneNumber">
                            +39 {contact.phone_number}
                        </small>
                    </div>
                </div>
            </div>
    )
}