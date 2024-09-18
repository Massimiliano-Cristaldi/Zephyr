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
    //TODO: Make it possible to toggle the popup by selecting with keyboard instead of mouse
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
    console.log(selectedText);

    //Close font style popup and remove selection upon clicking Esc
    //FIX: This function behaves weirdly when the selected text occurs multiple times 
    //(the first instance of the text is changed, even if it's not the selected one)
    function closeFontStylePopup(e:React.KeyboardEvent<HTMLInputElement>){
        if (e.key === "Escape" && fontStylePopupRef.current){
            window.getSelection()?.removeAllRanges();
            fontStylePopupRef.current.style.display = "none";
        }
    }
    
    //Make text italic, bold or underlined
    function changeTextStyle(style:string){
        if (inputRef.current) {
            switch (style) {
                case "italics":
                    inputRef.current.value = inputRef.current.value.replace(selectedText, `<i>${selectedText}</i>`);
                break;
                case "bold":
                    inputRef.current.value = inputRef.current.value.replace(selectedText, `<b>${selectedText}</b>`);
                break;
                case "underline":
                    inputRef.current.value = inputRef.current.value.replace(selectedText, `<u>${selectedText}</u>`);
                    break;
                }
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
                    <input type="text" placeholder="Enter message" ref={inputRef} onChange={handleChange} onKeyUp={closeFontStylePopup}/>
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