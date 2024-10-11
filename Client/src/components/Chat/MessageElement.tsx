import {  useContext, useRef, useEffect } from "react";
import axios from "axios";
import { AuthUserContext, ChatTypeContext, FontStylePopupContext, getDate, getTime, MessageReplyContext, sanitizeMessageInput } from "../../utils.tsx";
import { MessageElementProps, UseStateArray } from "../../types";
import MessageDropdown from "./MessageDropdown";
import "../../css/MessageElement.css";

export default function MessageElement({message, refs, newMessageState, deletedMessageState}: MessageElementProps){

    const authUser = useContext(AuthUserContext);

    const messageContentRef = useRef<HTMLDivElement>(null);
    const [replyRef, replyNameRef] = useContext(MessageReplyContext).refs;
    const replyContentRef = useRef<HTMLDivElement>(null);
    const inputReplyRef = refs;
    const [chatInputRef] = useContext(FontStylePopupContext).refs;

    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext);
    const [newMessage, setNewMessage] = newMessageState;
    const [deletedMessageCount, setDeletedMessageCount] = deletedMessageState;
    const [repliedMessage, setRepliedMessage]:UseStateArray = useContext(MessageReplyContext).states;

    //Set message box content on loading the element or deleting the message
    useEffect(()=>{
        if (messageContentRef.current) {
            if (message.content){
                messageContentRef.current.innerHTML = sanitizeMessageInput(message.content);
            } else if (message.content === ""){
                messageContentRef.current.innerHTML = "<i>This message has been deleted.</i>";
            } else if (message.content === null && message.audio_content){
                messageContentRef.current.innerHTML = `<audio controls src="${message.audio_content}"/>`;
            }
        }
        if (replyContentRef.current && message.replied_message_content) {
                replyContentRef.current.innerHTML = message.replied_message_content;
        }
    }, [deletedMessageCount])
    
    //Connect current message to the message you're replying to, make the reply box above the chat input appear
    function handleReply(){
        setRepliedMessage(message);
        setNewMessage({...newMessage, replying_to_message_id: message.id});
        if (replyRef.current && inputReplyRef.current) {
            replyRef.current.style.display = "block";
            replyNameRef.current.innerText = " " + (message.sender_id === authUser.id ?
                authUser.username : (message.sender_added_as || message.sender_username));
            if (message.content){
                inputReplyRef.current.innerHTML = message.content;
            } else if (message.audio_content){
                inputReplyRef.current.innerHTML = `<audio controls src="${message.audio_content}"/>`;
            }
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
            {chatType === "groupChat" &&
            (<div className={message.sender_id == authUser.id ? "messageSenderName" : "messageRecipientName"}>
                ~ {message.sender_added_as || message.sender_username}:
            </div>)}

            <div
            key={message.id} 
            className={message.sender_id == authUser.id ? "senderMessage" : "recipientMessage"}
            >
                <div className="pt-2">
                    {message.replied_message_content && 
                    <div className={message.sender_id == authUser.id ? "senderRepliedMessage" : "recipientRepliedMessage"}>
                        <i>Replying to
                            <b>
                                {message.replied_message_sender_id == authUser.id ? 
                                " " + authUser.username : 
                                (" " + message.replied_message_sender_added_as || message.replied_message_sender_username)}
                            </b>
                            's message:
                        </i>
                        <div ref={replyContentRef}/>
                    </div>}
                    <div ref={messageContentRef} className="messageContent"/>
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