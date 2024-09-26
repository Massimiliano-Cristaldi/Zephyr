import { ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { MessageCountContext, MessageReplyContext, sanitizeMessageInput } from "../../utils";
import "../../css/ChatInput.css"

export default function ChatInput({states, refs, actions}:any){

    const [sessionMessageCount, setSessionMessageCount] = useContext(MessageCountContext);
    const replyRef = useContext(MessageReplyContext).refs;
    const repliedMessage = useContext(MessageReplyContext).states[0];
    const [newMessage, setNewMessage] = [states[0][0], states[0][1]];
    const selectedText = states[1][0];
    const [chatInputRef, fontStylePopupRef] = refs;
    const toggleFontStylePopup = actions;

    function handleChatInputChange(e: ChangeEvent<HTMLInputElement>){
        setNewMessage({...newMessage, content: sanitizeMessageInput(e.target.value)});
    }

    //Send message and make the reply box disappear
    function sendMessage(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (chatInputRef && chatInputRef.current?.value !== "") {
                axios.post("http://localhost:8800/messages", newMessage)
                .then(()=>{
                    setSessionMessageCount(sessionMessageCount + 1);
                    setNewMessage({...newMessage, replying_to_message_id: null});
                    replyRef.current!.style.innerHTML = "<div><i>Replying to:</i> <br/></div>";
                    replyRef.current!.style.display = "none";
                });
                chatInputRef.current!.value = "";
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
        
    //Make text italic, bold or underlined
    function changeTextStyle(style:string){
        const input = chatInputRef.current;
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
            input.value = input.value.slice(0, input.selectionStart) + selection + input.value.slice(input.selectionEnd, input.value.length);
            input.focus();
            setNewMessage({...newMessage, content: input.value});
        }
    }

    return(
        <>
            <div id="replyWrapper" ref={replyRef}>
                <div >
                    <i>Replying to:</i>
                    <br />
                    {repliedMessage.content}
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