import { useContext, useRef, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Message } from "../../types";
import { AuthUserContext, getDate, getTime, sanitizeMessageInput } from "../../utils";
import "../../css/MessageElement.css";

interface MessageElementProps{
    message: Message,
    states: [number, Dispatch<SetStateAction<number>>]
}

export default function MessageElement({message, states}: MessageElementProps){

    const authId = useContext(AuthUserContext);
    const messageContentRef = useRef<HTMLDivElement>(null);
    const [deletedMessageCount, setDeletedMessageCount] = states;
    console.log(message);
    

    useEffect(()=>{
        if (messageContentRef.current) {
            if (message.content) {
                messageContentRef.current.innerHTML = sanitizeMessageInput(message.content);
            } else {
                messageContentRef.current.innerHTML = "<i>This message has been deleted.</i>";
            }
        }
    }, [deletedMessageCount])

    function deleteMessage(){
        try {
            axios.post("http://localhost:8800/deletemessage", {messageId: message.id})
            .then(()=>{setDeletedMessageCount(deletedMessageCount + 1); message.content = "";});
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <>
            <div
            key={message.id} 
            className={(message.sender_id == authId) ? "senderMessage" : "recipientMessage"}
            >
                <div>
                    {message.replied_message_content && 
                        <div className={(message.sender_id == authId) ? "senderRepliedMessage" : "recipientRepliedMessage"}>
                            <i>Replying to: </i>
                            {message.replied_message_content}
                        </div>}
                    <div ref={messageContentRef}/>
                </div>
                {message.sender_id == authId && <i className="fa-solid fa-trash fa-xs deleteMessageIcon" onClick={deleteMessage}/>}
            </div>
            <small 
            className={(message.sender_id == authId) ? "timeSentSender" : "timeSentRecipient"} 
            data-toggle="tooltip" 
            title={message.time_sent ? getDate(message.time_sent) : "N/A"}
            >
                {message.time_sent ? getTime(message.time_sent, 2) : "N/A"}
                <i className="fa-regular fa-clock ms-1" />
            </small>
        </>
    )
}