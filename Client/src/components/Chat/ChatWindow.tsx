import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { useParams } from "react-router-dom";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import { AuthUserContext, FontStylePopupContext, MessageCountContext } from "../../utils";
import { Message } from "../../types";
import MessageElement from "./MessageElement";
import ChatInput from "./ChatInput";
import ViewProfile from "../ViewProfile";
import "../../css/ChatWindow.css";

export default function ChatWindow(){

    const contactId = useParams().contactId;
    const authId = useContext(AuthUserContext);
    const {actions, states, refs} = useContext(FontStylePopupContext);
    const [sessionMessageCount] = useContext(MessageCountContext);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [chatInputRef, fontStylePopupRef] = refs;

    const [messages, setMessages] = useState<Message[] | []>();
    const [message, setMessage] = useState<Message>({
        content: "",
        recipient_id: Number(contactId),
        sender_id: Number(authId),
    });
    const [deletedMessageCount, setDeletedMessageCount] = useState<number>(0);
    const [selectedText, setSelectedText] = states;    

    //Fetch messages
    useEffect(()=>{
        async function getMessages(){
            console.log("I'm here");
            
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
                setMessage({...message, recipient_id: Number(contactId)});      
            }
        }
        getMessages();
    }, [contactId, sessionMessageCount, deletedMessageCount])

    //Scroll to bottom on chat load
    useEffect(()=>{
        animateScroll.scrollToBottom({containerId: "messagesWrapper", duration: 0});
    }, [messages])

    const [toggleFontStylePopup] = actions;

    return(
        <>
            <div id="chatBody">
                {messages && messages.length ?
                (<div id="messagesWrapper" ref={scrollRef}>
                    {messages.map((message)=>(
                        <Fragment key={message.id}>
                            <MessageElement message={message} states={[deletedMessageCount, setDeletedMessageCount]}/>
                        </Fragment>
                    ))}
                    <ViewProfile/>
                </div>) : (
                    <div id="noMessages">
                        <i className="fa-regular fa-comments mb-5"></i>
                        There are no messages between you and this person. You can initiate a chat by typing in the input below.
                    </div>
                )}
            </div>
            <ChatInput
            states={[[message, setMessage], [selectedText, setSelectedText]]}
            refs={[chatInputRef, fontStylePopupRef]}
            actions={toggleFontStylePopup}
            />
        </>
    )
}