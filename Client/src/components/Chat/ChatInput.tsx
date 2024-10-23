import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, ChatTypeContext, EmojiPickerContext, MessageCountContext, MessageReplyContext, sanitizeMessageInput, getFileExt } from "../../utils.tsx";
import { ChatInputProps, UseStateArray } from "../../types";
import EmojiPicker from "./EmojiPicker";
import AudioRecorder from "./AudioRecorder.tsx";
import "../../css/ChatInput.css"

export default function ChatInput({refs, newMessageState, attachmentState, attachmentNameState, selectedTextState, actions}:ChatInputProps){

    const params = useParams();
    const authUser = useContext(AuthUserContext);

    const [replyRef, replyNameRef] = useContext(MessageReplyContext).refs;
    const [chatInputRef, inputReplyRef, fontStylePopupRef, inputAttachmentRef] = refs;
    const attachmentButtonRef = useRef<HTMLInputElement>(null);
    const emojiPickerWrapperRef = useContext(EmojiPickerContext).refs;
    const tabIndexSetterRef = useRef<HTMLInputElement>(null);

    const [chatType, setChatType]:UseStateArray = useContext(ChatTypeContext).state;
    const [newMessage, setNewMessage] = newMessageState;
    const [attachment, setAttachment] = attachmentState;
    const [attachmentName, setAttachmentName] = attachmentNameState;
    const [sessionMessageCount, setSessionMessageCount]:UseStateArray = useContext(MessageCountContext);
    const [currentPosition, setCurrentPosition] = useState<number|null>(null);
    const [selectedText, setSelectedText] = selectedTextState;
    const [isSelectingEmoji, setIsSelectingEmoji]:UseStateArray = useContext(EmojiPickerContext).states;
    
    //Cancel replying state when switching to a different chat
    useEffect(()=>{
        cancelReplyState();
        chatInputRef.current.focus();
    }, [params])

    //Set new message content every time the chat input's value changes
    function handleChatInputChange(e: ChangeEvent<HTMLInputElement>){
        setNewMessage({...newMessage, content: sanitizeMessageInput(e.target.value)});
    }

    //Send message and make the reply box disappear
    function sendMessage(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (chatInputRef && chatInputRef.current && (chatInputRef.current.value !== "" || newMessage.attachments)) {
            try {
                const q = chatType === "individualChat" ? "sendmessage" : "sendgroupmessage";
                if (attachment) {
                    axios.post("http://localhost:8800/postattachment", attachment)
                    .then(()=>{
                        axios.post(`http://localhost:8800/${q}`, newMessage)
                    })
                    .then(()=>{
                        setNewMessage({...newMessage, content: '', audio_content: null, attachments: null, replying_to_message_id: null});
                        setSessionMessageCount(sessionMessageCount + 1);
                        if (replyRef.current) {
                            replyRef.current.style.display = "none";
                        }
                    })
                    .catch((err)=>{
                        console.error("There was an error trying to post your attachment:" + err);
                    })
                } else {
                    axios.post(`http://localhost:8800/${q}`, newMessage)
                    .then(()=>{
                        setNewMessage({...newMessage, replying_to_message_id: null});
                        setSessionMessageCount(sessionMessageCount + 1);
                        if (replyRef.current) {
                            replyRef.current.style.display = "none";
                        }
                    })
                    .catch((err)=>{
                        console.error("There was an error trying to post your attachment:" + err);
                    })
                }
            } catch (err) {
                console.error("There was an error trying to post your message:" + err);
            } finally {
                chatInputRef.current.value = "";
                inputAttachmentRef.current.style.display = "none";
            }
        }
    }

    //Show/hide font style popup upon selecting/deselecting text with clicks
    const toggleFontStylePopup = actions;

    //Show/hide/move font style popup upon pressing keys that cause text selection to change
    function handleKeyboardEvents(e:React.KeyboardEvent<HTMLInputElement>){
        const triggers = ["ShiftLeft", "ShiftRight", "ArrowLeft", "ArrowRight", "Space", "Backspace", "Delete", "v", "x"];
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

    //Set attachment through the button inside the chat input (no drag and drop)
    function handleFileAttachment(){
        if (attachmentButtonRef.current?.files) {
            const fileObject = attachmentButtonRef.current.files[0];
            const fileName = "/attachments/attachment_" + authUser.id + "_" + Date.now() + getFileExt(fileObject.name);                    
            const formData = new FormData();
            formData.append("attachment", fileObject);
            formData.append("filename", fileName);
            setAttachment(formData);
            setAttachmentName(fileObject.name);
            setNewMessage({...newMessage, attachments: fileName});
            if (inputAttachmentRef.current) {
                inputAttachmentRef.current.style.display = "block";
            }
        }
    }

    //Remove the attachment from the current message, hide the attachment box
    function unsetAttachment(){
        if (inputAttachmentRef.current) {
            inputAttachmentRef.current.style.display = "none";
            setNewMessage({...newMessage, attachments: null});
            setAttachmentName("");
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

    //Show/hide the box containing all the emojis
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
        chatInputRef.current.focus();
        chatInputRef.current.setSelectionRange(currentPosition, currentPosition);
    }

    return(
        <>
            <div id="replyWrapper" ref={replyRef}>
                <div>
                    <i>Replying to
                        <b ref={replyNameRef}/>
                        's message:
                    </i>
                    <br />
                    <div ref={inputReplyRef}/>
                    <i className="fa-solid fa-xmark" onClick={cancelReplyState}/>
                </div>
            </div>

            <div id="inputAttachmentWrapper" ref={inputAttachmentRef}>
                <div>
                    <i>Attachment:</i> <br/>
                    <i className="fa-solid fa-paperclip"/> {attachmentName}
                    <i className="fa-solid fa-xmark" onClick={unsetAttachment}/>
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
                    style={{color: "var(--defaultFontColor)"}}
                    onClick={toggleEmojiPicker}
                    />

                    <input 
                    type="text" 
                    ref={chatInputRef}
                    onChange={handleChatInputChange} 
                    onKeyUp={handleKeyboardEvents}
                    onClick={()=>{setCurrentPosition(chatInputRef.current!.selectionStart)}}
                    onMouseEnter={()=>{setIsSelectingEmoji(true)}}
                    onMouseLeave={()=>{setIsSelectingEmoji(false)}}
                    id="messageInput"
                    autoComplete="off"
                    />

                    <label htmlFor="attachment" id="attachmentButton">
                        <i className="fa-solid fa-paperclip"/>
                    </label>
                    <input 
                    type="file" 
                    name="attachment" 
                    id="attachment"
                    className="d-none" 
                    ref={attachmentButtonRef}
                    onChange={handleFileAttachment}/>

                    <button id="sendMessageButton">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>

                <AudioRecorder
                newMessageState={[newMessage, setNewMessage]}
                refs={[replyRef, chatInputRef]}
                />

                <div id="fontStylePopup" ref={fontStylePopupRef}>
                    <i className="fa-solid fa-italic" style={{color: "#f2f2f2"}} onClick={()=>{changeTextStyle("italics")}}/>
                    <i className="fa-solid fa-bold" style={{color: "#f2f2f2"}} onClick={()=>{changeTextStyle("bold")}}/>
                    <i className="fa-solid fa-underline" style={{color: "#f2f2f2"}} onClick={()=>{changeTextStyle("underline")}}/>
                </div>
            </div>
        </>
    )
}