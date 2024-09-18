import { useState, useEffect, useRef, FormEvent, ChangeEvent, Fragment, useContext } from "react";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import MessageElement from "./MessageElement";
import { Message } from "../../types";
import { useParams } from "react-router-dom";
import { AuthUserContext, MessageCountContext, getCaretCoordinates } from "../../utils";
import "./ChatWindow.css";

export default function ChatWindow(){

    const {_, contactId} = useParams();
    const authId = useContext(AuthUserContext);
    const [sessionMessageCount, setSessionMessageCount] = useContext(MessageCountContext);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fontStylePopupRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[] | []>();
    const [message, setMessage] = useState<Message>({
        content: "",
        recipient_id: Number(contactId),
        sender_id: Number(authId),
    });
    const [textCursorOffset, setTextCursorOffset] = useState(0)
    
    //Fetch messages
    useEffect(()=>{
        async function getMessages(){
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
    }, [sessionMessageCount, contactId])

    //Scroll to bottom on chat load
    useEffect(()=>{
        animateScroll.scrollToBottom({containerId: "messagesWrapper", duration: 0});
    }, [messages])

    //Post message to database
    function sendMessage(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (inputRef && inputRef.current?.value !== "") {
                axios.post("http://localhost:8800/messages", message)
                .then(()=>{setSessionMessageCount(sessionMessageCount + 1)});
                inputRef.current!.value = "";
        }
    }

    //Change message.content and get text cursor position on input value change
    function handleChange(e: ChangeEvent<HTMLInputElement>){
        setMessage({...message, content: e.target.value});

        const input = inputRef.current;
        const position = input?.selectionStart;
        if (position){
            const leftOffset = getCaretCoordinates(input, position).left;
            setTextCursorOffset(leftOffset);
        }
    }

    //TODO: Make it so that popup changes place if selection position changes, fix popup left offset 
    //Make popup for italics/bold appear on mouseUp
    function toggleFontStylePopup(){
        const selectionLength = window.getSelection()?.toString().length;
        const isSelectionInInput = window.getSelection()?.getRangeAt(0).getBoundingClientRect().height === 0;
        const isValidSelection = selectionLength && selectionLength > 0 && fontStylePopupRef.current && isSelectionInInput;
        const isNothingSelected = selectionLength === 0 || selectionLength === undefined;

        if (isValidSelection){
            const leftOffset = textCursorOffset > 170 ? textCursorOffset - 150 : 20;
            fontStylePopupRef.current.style.display = "flex";
            fontStylePopupRef.current.style.left = `${leftOffset}px`;
        } else if (isNothingSelected){
            fontStylePopupRef.current!.style.display = "none";
        }
    }
    
    return(
        <>
            <div id="chatBody" onMouseUp={toggleFontStylePopup}>
                {messages && messages.length ?
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
            <div id="chatInputWrapper" onMouseUp={toggleFontStylePopup}>
                <form onSubmit={sendMessage}>
                    <input type="text" placeholder="Enter message" ref={inputRef} onChange={handleChange}/>
                    <button>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
                <div id="fontStylePopup" ref={fontStylePopupRef}>Minchia</div>
            </div>
        </>
    )
}