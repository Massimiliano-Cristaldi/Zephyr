import { useState, useEffect, useRef, FormEvent, ChangeEvent, Fragment, useContext, KeyboardEventHandler } from "react";
import { animateScroll } from 'react-scroll';
import axios from "axios";
import MessageElement from "./MessageElement";
import { Message } from "../../types";
import { useParams } from "react-router-dom";
import { AuthUserContext, MessageCountContext, getCaretCoordinates, sanitizeMessageInput } from "../../utils";
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
    
    //Change message.content on input value change
    function handleChange(e: ChangeEvent<HTMLInputElement>){
        setMessage({...message, content: sanitizeMessageInput(e.target.value)});
    }
    
    //Post message to database
    function sendMessage(e: FormEvent<HTMLFormElement>){
            e.preventDefault();
            if (inputRef && inputRef.current?.value !== "") {
                    axios.post("http://localhost:8800/messages", message)
                    .then(()=>{setSessionMessageCount(sessionMessageCount + 1)});
                    inputRef.current!.value = "";
            }
    }

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

    //Close font style popup and remove selection upon clicking Esc
    function handleKeyboardEvents(e:React.KeyboardEvent<HTMLInputElement>){
        const triggers = ["ShiftLeft", "ShiftRight", "ArrowLeft", "ArrowRight"];
        if (fontStylePopupRef.current) {
            if (e.key === "Escape"){
                window.getSelection()?.removeAllRanges();
                fontStylePopupRef.current.style.display = "none";
            } else if (triggers.includes(e.code) || triggers.includes(e.key)){
                toggleFontStylePopup();
            }
        }
    }
    
    //Make text italic, bold or underlined
    function changeTextStyle(style:string){
        const input = inputRef.current;
        if (input && input.selectionStart && input.selectionEnd) {
            let selection;
            switch (style) {
                case "italics":
                    selection = `<i>${selectedText}</i>`;
                break;
                case "bold":
                    selection = `<b>${selectedText}</b>`;
                break;
                case "underline":
                    selection = `<u>${selectedText}</u>`;
                break;
            }
            inputRef.current.value = input.value.slice(0, input.selectionStart) + selection + input.value.slice(input.selectionEnd, input.value.length); 
            setMessage({...message, content: inputRef.current.value});
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
                    <input type="text" placeholder="Enter message" ref={inputRef} onChange={handleChange} onKeyUp={handleKeyboardEvents}/>
                    <button>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
                <div id="fontStylePopup" ref={fontStylePopupRef}>
                    <i className="fa-solid fa-italic" style={{color: "#f2f2f2"}} onClick={()=>{changeTextStyle("italics")}}/>
                    <i className="fa-solid fa-bold" style={{color: "#f2f2f2"}} onClick={()=>{changeTextStyle("bold")}}/>
                    <i className="fa-solid fa-underline" style={{color: "#f2f2f2"}} onClick={()=>{changeTextStyle("underline")}}/>
                </div>
            </div>
        </>
    )
}