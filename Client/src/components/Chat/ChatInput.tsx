import { ChangeEvent, FormEvent, useContext, useEffect } from "react";
import axios from "axios";
import { MessageCountContext, MessageReplyContext, sanitizeMessageInput } from "../../utils";
import { ChatInputProps } from "../../types";
import "../../css/ChatInput.css"
import { useParams } from "react-router-dom";

//TODO: The box above chat input check ternary operator only on mount, always returning repliedMessage.replied_message_sender_id
export default function ChatInput({refs, newMessageState, selectedTextState, actions}:ChatInputProps){

    const params = useParams();
    const [replyRef, replyNameRef] = useContext(MessageReplyContext).refs;
    const [chatInputRef, inputReplyRef, fontStylePopupRef] = refs;
    const [newMessage, setNewMessage] = newMessageState;
    const [selectedText, setSelectedText] = selectedTextState;
    const [sessionMessageCount, setSessionMessageCount] = useContext(MessageCountContext);
    const toggleFontStylePopup = actions;

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
        if (chatInputRef && chatInputRef.current?.value !== "") {
                axios.post("http://localhost:8800/sendmessage", newMessage)
                .then(()=>{
                    setNewMessage({...newMessage, replying_to_message_id: null});
                    setSessionMessageCount(sessionMessageCount + 1);
                    if (replyRef.current) {
                        replyRef.current.style.innerHTML = "<div><i>Replying to:</i> <br/></div>";
                        replyRef.current.style.display = "none";
                    }
                });
                if (chatInputRef.current) {
                    chatInputRef.current.value = "";
                }
        }
    }

    //Show/hide/move font style popup upon pressing certain keys
    function handleKeyboardEvents(e:React.KeyboardEvent<HTMLInputElement>){
        const triggers = ["ShiftLeft", "ShiftRight", "ArrowLeft", "ArrowRight", "Space", "Backspace", "Delete", "v"];
        if (fontStylePopupRef.current) {
            if (e.key === "Escape"){
                window.getSelection()?.removeAllRanges();
                fontStylePopupRef.current.style.display = "none";
            } else if (triggers.includes(e.code) || triggers.includes(e.key)){
                toggleFontStylePopup();
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
            <div id="chatInputWrapper" onMouseUp={toggleFontStylePopup}>
                <form onSubmit={sendMessage}>
                    <input 
                    type="text" 
                    placeholder="Enter message" 
                    ref={chatInputRef}
                    onChange={handleChatInputChange} 
                    onKeyUp={handleKeyboardEvents}
                    id="messageInput"
                    autoComplete="off"
                    />
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