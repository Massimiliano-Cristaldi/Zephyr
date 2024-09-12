import { Message } from "../../types";
import { getDate, getTime } from "../../utils";

interface MessageElementProps{
    message: Message
}

export default function MessageElement({message}: MessageElementProps){

    const authId = 1;

    return(
        <>
            <div
            key={message.id} 
            className={(message.sender_id == authId) ? "senderMessage" : "recipientMessage"}
            >
                {message.content}
                <br />
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