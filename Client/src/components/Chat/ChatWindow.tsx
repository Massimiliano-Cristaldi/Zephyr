import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { useParams } from "react-router-dom";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import { AuthUserContext, FontStylePopupContext, MessageCountContext, MessageReplyContext } from "../../utils";
import { Message } from "../../types";
import MessageElement from "./MessageElement";
import ChatInput from "./ChatInput";
import ViewProfile from "../ViewProfile";
import "../../css/ChatWindow.css";

export default function ChatWindow(){

    const contactId = useParams().contactId;
    const authId = useContext(AuthUserContext);
    const {actions, states, refs} = useContext(FontStylePopupContext);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const replyRef = useRef<HTMLDivElement>(null);
    const [chatInputRef, fontStylePopupRef] = refs;
    
    const [messages, setMessages] = useState<Message[] | []>();
    const [newMessage, setNewMessage] = useState<Message>({
        content: "",
        sender_id: Number(authId),
        recipient_id: Number(contactId),
        replying_to_message_id: null
    });
    const [deletedMessageCount, setDeletedMessageCount] = useState<number>(0);
    const [repliedMessage, setRepliedMessage] = useState<string>("");
    const [sessionMessageCount] = useContext(MessageCountContext);
    const [selectedText, setSelectedText] = states;    

    //Fetch messages
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/messages/${authId}/${contactId}`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setMessages(response.data);
            } catch (err) {
                console.error(err);
                setMessages([]);
            } finally {
                setNewMessage({...newMessage, recipient_id: Number(contactId)});      
            }
        }
        fetchData();
    }, [contactId, sessionMessageCount, deletedMessageCount])

    //Scroll to bottom when chat is loaded or a new message is posted
    useEffect(()=>{
        animateScroll.scrollToBottom({containerId: "messagesWrapper", duration: 0});
    }, [messages])

    const [toggleFontStylePopup] = actions;

    return(
        <MessageReplyContext.Provider value={{refs: replyRef, states: [repliedMessage, setRepliedMessage]}}>
            <div id="chatBody">
                {messages && messages.length ?
                (<div id="messagesWrapper" ref={scrollRef}>
                    {messages.map((el)=>(
                        <Fragment key={el.id}>
                            <MessageElement 
                            message={el} 
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
            states={[[newMessage, setNewMessage], [selectedText, setSelectedText]]}
            refs={[chatInputRef, fontStylePopupRef]}
            actions={toggleFontStylePopup}
            />
            </div>
        </MessageReplyContext.Provider>
    )
}