import { useContext, useRef } from "react";
import { AuthUserContext } from "../../utils";
import { MessageDropdownProps } from "../../types";
import "../../css/MessageDropdown.css";

export default function MessageDropdown(props: MessageDropdownProps){

    const authUser = useContext(AuthUserContext);
    const messageDropdownRef = useRef<HTMLUListElement>(null);
    const message = props.message;

    function toggleMessageDropdown(){
        if (messageDropdownRef.current) {
            if (messageDropdownRef.current.style.display === "flex") {
                messageDropdownRef.current.style.display = "none";
            } else {
                messageDropdownRef.current.style.display = "flex";
            }
        }
    }

    function hideMessageDropdown(){
        if (messageDropdownRef.current) {
                messageDropdownRef.current.style.display = "none";
        }
    }

    const [handleReply, deleteMessage] = props.actions;

    return(
        <div className="messageDropdownWrapper">
                    <i 
                    className="fa-solid fa-chevron-down messageDropdownButton" 
                    onClick={toggleMessageDropdown} 
                    onBlur={hideMessageDropdown}
                    tabIndex={0}
                    />
                    <ul 
                    className={(message.sender_id == authUser.id) ? "senderMessageDropdown" : "recipientMessageDropdown"}
                    ref={messageDropdownRef}
                    >
                        <li onMouseDown={handleReply}>Reply</li>
                        {message.sender_id == authUser.id && <li onMouseDown={deleteMessage}>Delete</li>}
                    </ul>
        </div>
    )
}