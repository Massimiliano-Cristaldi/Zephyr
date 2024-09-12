import { useState, useEffect, useRef, FormEvent, ChangeEvent, Fragment } from "react";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import MessageElement from "./MessageElement";
import "./ChatWindow.css";
import { Message } from "../../types";
import { useParams } from "react-router-dom";

export default function ChatWindow(){

    // FIX: When on mobile refreshing the page on url /chat/id/id makes the contact list appear again

    const {authId, contactId} = useParams();
    const [messages, setMessages] = useState<Message[] | []>();
    const [message, setMessage] = useState<Message>({
        content: "",
        recipient_id: Number(contactId),
        sender_id: Number(authId),
    });
    const [sessionMessageCount, setSessionMessageCount] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    function sendMessage(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (inputRef) {
            if (inputRef.current?.value !== "") {
                axios.post("http://localhost:8800/messages", message)
                .then(()=>{setSessionMessageCount(sessionMessageCount + 1)});
                inputRef.current!.value = "";
            }
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        setMessage({...message, content: e.target.value})
    }

    useEffect(()=>{
        async function get_messages(){
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
        get_messages();
    }, [sessionMessageCount, contactId])
    
    useEffect(()=>{
        animateScroll.scrollToBottom({containerId: "messages_wrapper", duration: 0})
    }, [messages])
    
    return(
        <>
            <div id="chatBody">
                {messages && messages.length !== 0 ?
                (<div id="messagesWrapper" ref={scrollRef}>
                    {messages.map((message)=>(
                        <Fragment key={message.id}>
                            <MessageElement message={message}/>
                        </Fragment>
                    ))}
                </div>) : (
                    <div id="noMessages">
                        <i className="fa-regular fa-comments mb-5"></i>
                        There are no messages between you and this person. You can initiate a chat by typing in the input below.
                    </div>
                )}
            </div>
            <div id="chatInputWrapper">
                <form onSubmit={sendMessage}>
                    <input type="text" placeholder="Enter message" ref={inputRef} onChange={handleChange}/>
                    <button>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </>
    )
}