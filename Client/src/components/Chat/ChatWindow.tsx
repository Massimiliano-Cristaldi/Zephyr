import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import { AuthUserContext, ChatTypeContext, FontStylePopupContext, MessageCountContext, MessageReplyContext } from "../../utils.tsx";
import { GroupMessage, Message, UseStateArray } from "../../types";
import MessageElement from "./MessageElement";
import ChatInput from "./ChatInput";
import ViewProfile from "../ViewProfile";
import "../../css/ChatWindow.css";

export default function ChatWindow(){

    const params = useParams();
    const authUser = useContext(AuthUserContext);
    const {actions, states, refs} = useContext(FontStylePopupContext);
    
    const [chatInputRef, fontStylePopupRef] = refs;
    const replyRef = useRef<HTMLDivElement>(null);
    const replyNameRef = useRef<HTMLElement>(null);
    const inputReplyRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext);
    const [messages, setMessages] = useState<Message[] | GroupMessage[] | []>();
    const [newMessage, setNewMessage] = useState<Message | GroupMessage>(()=>{
        return chatType === "individualChat" ? {
            content: "",
            attachments: null,
            recipient_id: Number(params.contactId),
            sender_id: Number(authUser.id),
            sender_username: authUser.username
        } : {
            content: "",
            attachments: null,
            group_id: Number(params.groupId),
            sender_id: Number(authUser.id),
            sender_username: authUser.username
        }
    });
    const [deletedMessageCount, setDeletedMessageCount] = useState<number>(0);
    const [repliedMessage, setRepliedMessage] = useState<Message | null>(null);
    const [sessionMessageCount] = useContext(MessageCountContext);
    const [selectedText, setSelectedText]:UseStateArray = states;    

    //Fetch messages
    useEffect(()=>{
        async function fetchData(){
            const q = chatType === "individualChat" ? `messages/${authUser.id}/${params.contactId}` : `groupmessages/${authUser.id}/${params.groupId}`
            try {
                const response = await axios.get(`http://localhost:8800/${q}`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
            }
                setMessages(response.data[0]);
            } catch (err) {
                console.error(err);
                setMessages([]);
            } finally {
                if (chatType === "individualChat"){
                    setNewMessage({...newMessage, sender_id: authUser.id, sender_username: authUser.username, recipient_id: Number(params.contactId)});      
                } else if (chatType === "groupChat"){
                    setNewMessage({...newMessage, sender_id: authUser.id, sender_username: authUser.username, group_id: Number(params.groupId)});      
                }
            }
        }
        fetchData();
    }, [chatType, authUser.id, params, sessionMessageCount, deletedMessageCount])

    //Scroll to bottom when chat is loaded or a new message is posted
    useEffect(()=>{
        animateScroll.scrollToBottom({containerId: "messagesWrapper", duration: 0});
    }, [messages])

    const [toggleFontStylePopup] = actions;    

    return(
        <MessageReplyContext.Provider value={{refs: [replyRef, replyNameRef], states: [repliedMessage, setRepliedMessage]}}>
            <div id="chatBody">
                {messages && messages.length ?
                (<div id="messagesWrapper" ref={scrollRef}>
                    {messages.map((el)=>(
                            <MessageElement 
                            key={el.id}
                            message={el}
                            refs={inputReplyRef}
                            newMessageState={[newMessage, setNewMessage]} 
                            deletedMessageState={[deletedMessageCount, setDeletedMessageCount]}/>
                    ))}
                    <ViewProfile/>
                </div>) : (
                    <div id="noMessages">
                        <i className="fa-regular fa-comments mb-5"></i>
                        {chatType === "individualChat" ? 
                        "There are no messages between you and this person. You can initiate a chat by typing in the input below." :
                        "There are no messages in this group. You can initiate this chat by typing in the input below."}
                    </div>
                )}
            <ChatInput
            refs={[chatInputRef, inputReplyRef, fontStylePopupRef]}
            newMessageState={[newMessage, setNewMessage]}
            selectedTextState={[selectedText, setSelectedText]}
            actions={toggleFontStylePopup}
            />
            </div>
        </MessageReplyContext.Provider>
    )
}