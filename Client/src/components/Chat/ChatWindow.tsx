import { useState, useEffect, useRef, Fragment, useContext } from "react";
import { useParams } from "react-router-dom";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import { AuthUserContext, MessageCountContext, getCaretCoordinates } from "../../utils";
import { Message } from "../../types";
import MessageElement from "./MessageElement";
import ChatInput from "./ChatInput";
import "./ChatWindow.css";

export default function ChatWindow(){

    const {_, contactId} = useParams();
    const authId = useContext(AuthUserContext);
    const [sessionMessageCount] = useContext(MessageCountContext);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fontStylePopupRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[] | []>();
    const [message, setMessage] = useState<Message>({
        content: "",
        recipient_id: Number(contactId),
        sender_id: Number(authId),
    });
    const [selectedText, setSelectedText] = useState<string>("");
    
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

    //Make font style popup dialog appear/disappear when selecting/deselecting text in the chat input
    function toggleFontStylePopup(){
        const input = inputRef.current;
        const position = input?.selectionStart;
        const selection = window.getSelection();
        if (input && position !== null && position !== undefined){
            const selectionLength = selection?.toString().length;
            const isSelectionInInput = selection?.getRangeAt(0).getBoundingClientRect().height === 0;
            const isNothingSelected = fontStylePopupRef.current && (selectionLength === 0 || selectionLength === undefined);
            const isValidSelection = fontStylePopupRef.current && !isNothingSelected && isSelectionInInput;
            if (isValidSelection){
                const leftOffset = getCaretCoordinates(input, position).left;
                setSelectedText(selection!.toString());
                fontStylePopupRef.current.style.display = "flex";
                fontStylePopupRef.current.style.left = `${leftOffset + 20}px`;
            } else if (isNothingSelected){
                fontStylePopupRef.current.style.display = "none";
            }
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
            <ChatInput
            states={[[message, setMessage], [selectedText, setSelectedText]]}
            refs={[inputRef, fontStylePopupRef]}
            actions={toggleFontStylePopup}
            />
        </>
    )
}