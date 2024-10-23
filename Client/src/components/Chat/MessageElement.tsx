import {  useContext, useRef, useEffect } from "react";
import axios from "axios";
import { AuthUserContext, ChatTypeContext, formatTime, getDate, getTime, MessageReplyContext, sanitizeMessageInput } from "../../utils.tsx";
import { MessageElementProps, UseStateArray } from "../../types";
import MessageDropdown from "./MessageDropdown";
import AudioElement from "./AudioElement.tsx";
import "../../css/MessageElement.css";
import AttachmentElement from "./AttachmentElement.tsx";

export default function MessageElement({message, refs, newMessageState, deletedMessageState}: MessageElementProps){

    const authUser = useContext(AuthUserContext);

    const messageContentRef = useRef<HTMLDivElement>(null);
    const [replyRef, replyNameRef] = useContext(MessageReplyContext).refs;
    const replyContentRef = useRef<HTMLDivElement>(null);
    const inputReplyRef = refs;
    const audioRef = useRef<HTMLAudioElement>(null);
    const repliedAudioRef = useRef<HTMLAudioElement>(null);

    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext).state;
    const [newMessage, setNewMessage] = newMessageState;
    const [deletedMessageCount, setDeletedMessageCount] = deletedMessageState;
    const [repliedMessage, setRepliedMessage]:UseStateArray = useContext(MessageReplyContext).states;

    //Set message box content
    useEffect(()=>{
        if (messageContentRef.current) {
            if (message.content){
                messageContentRef.current.innerHTML = sanitizeMessageInput(message.content);
            } else if (message.content === "" && message.audio_content === null && message.attachments === null){
                messageContentRef.current.innerHTML = "<i>This message has been deleted.</i>";
            }
        }
        //Set replied message box text content/audio content
        if (replyContentRef.current && message.replied_message_content){
            replyContentRef.current.innerHTML = message.replied_message_content;
        } else if (replyContentRef.current && repliedAudioRef.current?.duration && message.replied_message_audio_content){
            replyContentRef.current.innerHTML = `<i class="fa-solid fa-microphone"/>
                <span class="minutesAndSeconds">${formatTime(repliedAudioRef.current.duration, "minutes")
                + ":" + formatTime(repliedAudioRef.current.duration, "seconds")}</span>`
        }
    }, [deletedMessageCount, repliedAudioRef.current?.currentTime])

    //Connect current message to the message you're replying to, make the reply box above the chat input appear
    function handleReply(){
        setRepliedMessage(message);
        setNewMessage({...newMessage, replying_to_message_id: message.id});
        if (replyRef.current && inputReplyRef.current) {
            replyRef.current.style.display = "block";
            replyNameRef.current.innerText = " " + (message.sender_id === authUser.id ?
                authUser.username : (message.sender_added_as || message.sender_username));
            //Set text content/audio content of the replied message box above the chat input 
            if (message.content){
                inputReplyRef.current.innerHTML = message.content;
            } else if (audioRef.current && message.content === null && message.audio_content){
                inputReplyRef.current.innerHTML = `<i class="fa-solid fa-microphone"/>
                <span class="minutesAndSeconds">${formatTime(audioRef.current.duration, "minutes")
                + ":" + formatTime(audioRef.current.duration, "seconds")}</span>`;
            }
        }
    }

    //Change the message content to empty string and remove connection to replied message
    function deleteMessage(){
        try {
            const q = chatType === "individualChat" ? "deletemessage" : "deletegroupmessage";
            axios.post(`http://localhost:8800/${q}`, {messageId: message.id})
            .then(()=>{
                setDeletedMessageCount(deletedMessageCount + 1);
                message.content = "";
                message.audio_content = null;
                message.attachments = null;
                message.replied_message_content = "";
                if (newMessage.replying_to_message_id === message.id) {
                    setNewMessage({...newMessage, replying_to_message_id: null});
                    if (replyRef.current) {
                        replyRef.current.style.display = "none";
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    //Load the duration of the replied audio message when the audio metadata becomes available
    function syncRepliedAudioMessage(){
        if (replyContentRef.current && repliedAudioRef.current?.duration !== Infinity){
            replyContentRef.current.innerHTML = `<i class="fa-solid fa-microphone"/>
            <span class="minutesAndSeconds">${formatTime(repliedAudioRef.current!.duration, "minutes")
                + ":" + formatTime(repliedAudioRef.current!.duration, "seconds")}</span>`
        //Retry if the duration is still infinity (fixes inconsistencies)
        } else if (repliedAudioRef.current && repliedAudioRef.current?.duration === Infinity){
            repliedAudioRef.current.currentTime = 0;
        }
    }

    return(
        <div
        className={message.sender_id == authUser.id ? "senderMessage" : "recipientMessage"}
        >
            {chatType === "groupChat" &&
            (<div className={message.sender_id == authUser.id ? "messageSenderName" : "messageRecipientName"}>
                ~ {message.sender_added_as || message.sender_username}:
            </div>)}

            <div
            key={message.id} 
            >
                <div className="d-flex flex-column">
                    {(message.replied_message_content || message.replied_message_audio_content) && 
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

                    {message.attachments &&
                    <AttachmentElement
                    attachment={message.attachments}
                    senderId={message.sender_id}
                    />}

                    <div ref={messageContentRef} className="messageContent">
                        {message.audio_content &&
                            <AudioElement
                            audioSrc={message.audio_content}
                            />
                        }
                    </div>
                </div>
                {(message.content || message.audio_content || message.attachments) &&
                <MessageDropdown message={message} actions={[handleReply, deleteMessage]}/>}
            </div>

            <small 
            className={(message.sender_id == authUser.id) ? "timeSentSender" : "timeSentRecipient"} 
            data-toggle="tooltip" 
            title={message.time_sent ? getDate(message.time_sent) : "N/A"}
            >
                {message.time_sent ? getTime(message.time_sent, 2) : "N/A"}
                <i className="fa-regular fa-clock ms-1"/>
            </small>

            {message.audio_content &&
            <audio 
            ref={audioRef}
            className="d-none"
            onLoadedMetadata={()=>{audioRef.current!.currentTime = 0}}>
                <source src={message.audio_content}/>
            </audio>}

            {message.replied_message_audio_content &&
            <audio 
            ref={repliedAudioRef}
            className="d-none"
            onLoadedMetadata={()=>{repliedAudioRef.current!.currentTime = 0}}
            onTimeUpdate={syncRepliedAudioMessage}
            >
                <source src={message.replied_message_audio_content}/>
            </audio>}
        </div>
    )
}