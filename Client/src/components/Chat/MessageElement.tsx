import {  useContext, useRef, useEffect, Dispatch, SetStateAction, RefObject } from "react";
import axios from "axios";
import { AuthUserContext, getDate, getTime, MessageReplyContext, sanitizeMessageInput } from "../../utils.tsx";
import { MessageElementProps, UseStateArray } from "../../types";
import MessageDropdown from "./MessageDropdown";
import "../../css/MessageElement.css";

export default function MessageElement({message, refs, newMessageState, deletedMessageState}: MessageElementProps){

    const authUser = useContext(AuthUserContext);

    const messageContentRef = useRef<HTMLDivElement>(null);
    const [replyRef, replyNameRef] = useContext(MessageReplyContext).refs;
    const replyContentRef = useRef<HTMLDivElement>(null);
    const inputReplyRef = refs;

    const [newMessage, setNewMessage] = newMessageState;
    const [deletedMessageCount, setDeletedMessageCount] = deletedMessageState;
    const [repliedMessage, setRepliedMessage]:UseStateArray = useContext(MessageReplyContext).states;

    //Set message box content on loading the element or deleting the message
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
    
    //Connect current message to the message you're replying to, make the reply box above the chat input appear
    function handleReply(){
        try {
            axios.get(`http://localhost:8800/message/${message.id}`)
            .then((response)=>{
                setRepliedMessage(response.data[0]);
                setNewMessage({...newMessage, replying_to_message_id: message.id});
                if (replyRef.current && inputReplyRef.current) {
                    replyRef.current.style.display = "block";
                    replyNameRef.current.innerText = " " + (response.data[0].sender_id === authUser.id ?
                        authUser.username : response.data[0].replied_message_sender_username);
                    inputReplyRef.current.innerHTML = response.data[0].content;
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    //Change the message content to empty string and remove connection to replied message
    function deleteMessage(){
        try {
            axios.post("http://localhost:8800/deletemessage", {messageId: message.id})
            .then(()=>{
                setDeletedMessageCount(deletedMessageCount + 1); 
                setNewMessage({...newMessage, replying_to_message_id: null});
                message.content = "";
                message.replied_message_content = "";
            });
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <>
            <div
            key={message.id} 
            className={(message.sender_id == authUser.id) ? "senderMessage" : "recipientMessage"}
            >
                <div className="pt-2">
                    {message.replied_message_content && 
                    <div className={(message.sender_id == authUser.id) ? "senderRepliedMessage" : "recipientRepliedMessage"}>
                        <i>Replying to 
                            <b> {message.replied_message_sender_id == authUser.id ? authUser.username : message.replied_message_sender_username}</b>
                            's message:
                        </i>
                        <div ref={replyContentRef}/>
                    </div>}
                    <div ref={messageContentRef}/>
                    {message.content &&
                    <MessageDropdown message={message} actions={[handleReply, deleteMessage]}/>}
                </div>
            </div>
            <small 
            className={(message.sender_id == authUser.id) ? "timeSentSender" : "timeSentRecipient"} 
            data-toggle="tooltip" 
            title={message.time_sent ? getDate(message.time_sent) : "N/A"}
            >
                {message.time_sent ? getTime(message.time_sent, 2) : "N/A"}
                <i className="fa-regular fa-clock ms-1"/>
            </small>
        </>
    )
}