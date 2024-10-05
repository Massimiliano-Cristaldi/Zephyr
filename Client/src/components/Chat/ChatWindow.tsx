import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { useParams } from "react-router-dom";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import { AuthUserContext, FontStylePopupContext, MessageCountContext, MessageReplyContext } from "../../utils.tsx";
import { Message, UseStateArray } from "../../types";
import MessageElement from "./MessageElement";
import ChatInput from "./ChatInput";
import ViewProfile from "../ViewProfile";
import "../../css/ChatWindow.css";

export default function ChatWindow(){

    const contactId = useParams().contactId;
    const authUser = useContext(AuthUserContext);
    const {actions, states, refs} = useContext(FontStylePopupContext);
    
    const [chatInputRef, fontStylePopupRef] = refs;
    const replyRef = useRef<HTMLDivElement>(null);
    const replyNameRef = useRef<HTMLElement>(null);
    const inputReplyRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const [messages, setMessages] = useState<Message[] | []>();
    const [newMessage, setNewMessage] = useState<Message>({
        content: "",
        sender_id: Number(authUser.id),
        recipient_id: Number(contactId),
        replying_to_message_id: null
    });
    const [deletedMessageCount, setDeletedMessageCount] = useState<number>(0);
    const [repliedMessage, setRepliedMessage] = useState<Message | null>(null);
    const [sessionMessageCount] = useContext(MessageCountContext);
    const [selectedText, setSelectedText]:UseStateArray = states;    

    //Fetch messages
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/messages/${authUser.id}/${contactId}`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setMessages(response.data[0]);
            } catch (err) {
                console.error(err);
                setMessages([]);
            } finally {
                setNewMessage({...newMessage, sender_id: authUser.id, recipient_id: Number(contactId)});      
            }
        }
        fetchData();
    }, [authUser.id, contactId, sessionMessageCount, deletedMessageCount])

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
                        <Fragment key={el.id}>
                            <MessageElement 
                            message={el}
                            refs={inputReplyRef}
                            newMessageState={[newMessage, setNewMessage]} 
                            deletedMessageState={[deletedMessageCount, setDeletedMessageCount]}/>
                        </Fragment>
                    ))}
                    <ViewProfile/>
                </div>) : (
                    <div id="noMessages">
                        <i className="fa-regular fa-comments mb-5"></i>
                        There are no messages between you and this person. You can initiate a chat by typing in the input below.
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