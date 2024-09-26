import {  useContext, useRef, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Message } from "../../types";
import { AuthUserContext, getDate, getTime, MessageReplyContext, sanitizeMessageInput } from "../../utils";
import "../../css/MessageElement.css";
import MessageDropdown from "./MessageDropdown";

interface MessageElementProps{
    message: Message,
    newMessageState: [Message, Dispatch<SetStateAction<Message>>],
    deletedMessageState: [number, Dispatch<SetStateAction<number>>]
}

export default function MessageElement({message, newMessageState, deletedMessageState}: MessageElementProps){

    const authId = useContext(AuthUserContext);
    const messageContentRef = useRef<HTMLDivElement>(null);
    const replyRef = useContext(MessageReplyContext).refs;
    const replyContentRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = newMessageState;
    const setRepliedMessage = useContext(MessageReplyContext).states[1];
    const [deletedMessageCount, setDeletedMessageCount] = deletedMessageState;

    //Set message box content
    useEffect(()=>{
        if (messageContentRef.current) {
            if (message.content) {
                messageContentRef.current.innerHTML = sanitizeMessageInput(message.content);
            } else {
                messageContentRef.current.innerHTML = "<i>This message has been deleted.</i>";
            }
        }
        if (replyContentRef.current && message.replied_message_content) {
                replyContentRef.current.innerHTML = message.replied_message_content;
        }
    }, [deletedMessageCount])
    
    function handleReply(){
        try {
            axios.get(`http://localhost:8800/message/${message.id}`)
            .then((response)=>{
                setRepliedMessage(response.data[0]);
                setNewMessage({...newMessage, replying_to_message_id: message.id});
                replyRef.current!.style.display = "block";
                replyRef.current!.innerHTML = `<div><i>Replying to:</i> <br/>${response.data[0].content}</div>`;
            })
        } catch (err) {
            console.error(err);
        }
    }

    

    //FIX: Deleting a message with a reply doesn't delete the reply
    //Should suffice to change the query in index.js (set replying to message id = null)
    function deleteMessage(){
        try {
            axios.post("http://localhost:8800/deletemessage", {messageId: message.id})
            .then(()=>{
                setDeletedMessageCount(deletedMessageCount + 1); 
                setNewMessage({...newMessage, replying_to_message_id: null});
                message.content = ""; 
            });
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
                <div className="pt-2">
                    {message.replied_message_content && 
                    <div className={(message.sender_id == authId) ? "senderRepliedMessage" : "recipientRepliedMessage"}>
                        <i>Replying to: </i>
                        <div ref={replyContentRef}/>
                    </div>
                    }
                    <div ref={messageContentRef}/>
                    <MessageDropdown message={message} actions={[handleReply, deleteMessage]}/>
                </div>
            </div>
            <small 
            className={(message.sender_id == authId) ? "timeSentSender" : "timeSentRecipient"} 
            data-toggle="tooltip" 
            title={message.time_sent ? getDate(message.time_sent) : "N/A"}
            >
                {message.time_sent ? getTime(message.time_sent, 2) : "N/A"}
                <i className="fa-regular fa-clock ms-1"/>
            </small>
        </>
    )
}