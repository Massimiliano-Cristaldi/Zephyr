import { useContext, useRef, useEffect } from "react";
import { Message } from "../../types";
import { AuthUserContext, getDate, getTime } from "../../utils";

interface MessageElementProps{
    message: Message
}

export default function MessageElement({message}: MessageElementProps){

    const authId = useContext(AuthUserContext);
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if (messageRef.current) {
            messageRef.current.innerHTML = message.content;
        }
    }, [])

    return(
        <>
            <div
            key={message.id} 
            className={(message.sender_id == authId) ? "senderMessage" : "recipientMessage"}
            >
                <div ref={messageRef}></div>
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