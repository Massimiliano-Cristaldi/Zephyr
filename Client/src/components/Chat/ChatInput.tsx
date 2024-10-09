import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChatTypeContext, EmojiPickerContext, MessageCountContext, MessageReplyContext, sanitizeMessageInput } from "../../utils.tsx";
import { ChatInputProps, UseStateArray } from "../../types";
import EmojiPicker from "./EmojiPicker";
import AudioRecorder from "./AudioRecorder.tsx";
import "../../css/ChatInput.css"

export default function ChatInput({refs, newMessageState, selectedTextState, actions}:ChatInputProps){

    const params = useParams();

    const [replyRef, replyNameRef] = useContext(MessageReplyContext).refs;
    const [chatInputRef, inputReplyRef, fontStylePopupRef] = refs;
    const emojiPickerWrapperRef = useContext(EmojiPickerContext).refs;
    const tabIndexSetterRef = useRef<HTMLInputElement>(null);

    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext);
    const [newMessage, setNewMessage] = newMessageState;
    const [sessionMessageCount, setSessionMessageCount]:UseStateArray = useContext(MessageCountContext);
    const [currentPosition, setCurrentPosition] = useState<number|null>(null);
    const [selectedText, setSelectedText] = selectedTextState;
    const [isSelectingEmoji, setIsSelectingEmoji]:UseStateArray = useContext(EmojiPickerContext).states;
    
    //Cancel replying state when switching to a different chat
    useEffect(()=>{
        cancelReplyState();
    }, [params])

    //Set new message content every time the chat input's value changes
    function handleChatInputChange(e: ChangeEvent<HTMLInputElement>){
        setNewMessage({...newMessage, content: sanitizeMessageInput(e.target.value)});
    }

    //Send message and make the reply box disappear
    function sendMessage(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (chatInputRef && chatInputRef.current && chatInputRef.current.value !== "") {
            const q = chatType === "individualChat" ? "sendmessage" : "sendgroupmessage";
            axios.post(`http://localhost:8800/${q}`, newMessage)
            .then(()=>{
                setNewMessage({...newMessage, replying_to_message_id: null});
                setSessionMessageCount(sessionMessageCount + 1);
                if (replyRef.current) {
                    replyRef.current.style.innerHTML = "<div><i>Replying to:</i> <br/></div>";
                    replyRef.current.style.display = "none";
                }
            });
            chatInputRef.current.value = "";
        }
    }

    //Show/hide font style popup upon selecting/deselecting text with clicks
    const toggleFontStylePopup = actions;

    //Show/hide/move font style popup upon pressing keys that cause text selection to change
    function handleKeyboardEvents(e:React.KeyboardEvent<HTMLInputElement>){
        const triggers = ["ShiftLeft", "ShiftRight", "ArrowLeft", "ArrowRight", "Space", "Backspace", "Delete", "v"];
        if (fontStylePopupRef.current) {
            if (e.key === "Escape"){
                window.getSelection()?.removeAllRanges();
                fontStylePopupRef.current.style.display = "none";
            } else if (triggers.includes(e.code) || triggers.includes(e.key)){
                toggleFontStylePopup();
                setCurrentPosition(chatInputRef.current!.selectionStart);
            }
        }
    }

    //Hide the box containing the message you're replying to and set newMessage.replying_to_message_id = null
    function cancelReplyState(){
        if (replyRef.current) {
            replyRef.current.style.display = "none";
            setNewMessage({...newMessage, replying_to_message_id: null});
        }
    }
        
    //Make text italic, bold or underlined
    function changeTextStyle(style:string){
        const input = chatInputRef.current;
        if (input && input.selectionStart !== undefined && input.selectionEnd !== undefined) {
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
            input.value = input.value.slice(0, input.selectionStart) + selection + input.value.slice(input.selectionEnd, input.value.length);
            input.focus();
            setNewMessage({...newMessage, content: input.value});
        }
    }

    //Show the box containing all the emojis
    function toggleEmojiPicker(){
        if (emojiPickerWrapperRef.current) {
            if (emojiPickerWrapperRef.current.style.display === "block") {
                setIsSelectingEmoji(false);
                emojiPickerWrapperRef.current.style.display = "none";
            } else {
                setIsSelectingEmoji(true);
                emojiPickerWrapperRef.current.style.display = "block";
            }
        }
    }

    return(
        <>
            <div id="replyWrapper" ref={replyRef}>
                <div>
                    <i>Replying to
                        <b ref={replyNameRef}/>
                        's message
                    </i>
                    <br />
                    <div ref={inputReplyRef}/>
                    <i className="fa-solid fa-xmark" onClick={cancelReplyState}/>
                </div>
            </div>
            <div id="chatInputWrapper">
                <form onSubmit={sendMessage}>
                    <EmojiPicker 
                    refs={[emojiPickerWrapperRef, tabIndexSetterRef, chatInputRef]} 
                    currentPositionState={[currentPosition, setCurrentPosition]}
                    />
                    <i 
                    className="fa-regular fa-face-smile fa-lg" 
                    id="emojiButton" 
                    style={{color: "#ebebeb"}}
                    onClick={toggleEmojiPicker}
                    />
                    <input 
                    type="text" 
                    ref={chatInputRef}
                    onChange={handleChatInputChange} 
                    onKeyUp={handleKeyboardEvents}
                    onClick={()=>{setCurrentPosition(chatInputRef.current!.selectionStart)}}
                    id="messageInput"
                    autoComplete="off"
                    />
                    <AudioRecorder/>
                    <button id="sendMessageButton">
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