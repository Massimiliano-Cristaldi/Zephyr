import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ContactListRefContext, AuthUserContext, getCaretCoordinates, FontStylePopupContext,IsMobileContext, AuthIdContext, EmojiPickerContext, ChatTypeContext } from "../utils.tsx";
import { User } from "../types";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Body from "./Chat/Body";
import "../css/StyleVariables.css";
import "../css/index.css";
import { useNavigate } from "react-router-dom";

export default function Layout(){

    const navigate = useNavigate();

    const contactListRef = useRef<HTMLDivElement>(null);
    const chatWrapperRef = useRef<HTMLDivElement>(null);
    const backButtonRef = useRef<HTMLElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const fontStylePopupRef = useRef<HTMLDivElement>(null);
    const emojiPickerWrapperRef = useRef<HTMLDivElement>(null);

    const [authId, setAuthId] = useState<number>(1);
    const [authUser, setAuthUser] = useState<User>({
        id: 0,
        username: "Loading...",
        phone_number: 0,
        icon_url: null
    });
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 996);
    const [chatType, setChatType] = useState<string>("individualChat");
    const [selectedText, setSelectedText] = useState<string>("");
    const [isSelectingEmoji, setIsSelectingEmoji] = useState<boolean>(false);

    //Fetch logged user's info
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/userinfo/${authId}`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("User not found");
                }
                setAuthUser(response.data[0]);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [authId])

    //Load custom theme (if any)
    useEffect(()=>{
        const styles = document.documentElement.style;
        const theme = window.localStorage.getItem("theme");
        if (theme) {
            const colorProperties = JSON.parse(theme);
            for (const property in colorProperties) {
                if (Object.prototype.hasOwnProperty.call(colorProperties, property)) {
                    styles.setProperty(`--${property}`, colorProperties[property]);
                }
            }
        }
    }, [])

    //Make font style popup dialog appear/disappear when selecting/deselecting text in the chat input
    //The function appears here because the mouseup event should trigger when the mouse button is released anywhere
    function toggleFontStylePopup(){
        const input = chatInputRef.current;
        const position = input?.selectionStart;
        const selection = window.getSelection();
        if (input && position !== null && position !== undefined){
            const selectionLength = selection?.toString().length;
            const isSelectionInInput = selection?.getRangeAt(0).getBoundingClientRect().height === 0;
            const isNothingSelected = fontStylePopupRef.current && (selectionLength === 0 || selectionLength === undefined);
            const isValidSelection = fontStylePopupRef.current && !isNothingSelected && isSelectionInInput;
            if (isValidSelection && selection.type === "Range"){
                const leftOffset = getCaretCoordinates(input, position).left;
                setSelectedText(selection!.toString());
                fontStylePopupRef.current.style.display = "flex";
                fontStylePopupRef.current.style.left = `${leftOffset + 20}px`;
            } else if (isNothingSelected){
                fontStylePopupRef.current.style.display = "none";
            }
        }
    }

    //Hide the box with all the emojis upon clicking anywhere outside of it
    function closeEmojiPicker(){
        if (emojiPickerWrapperRef.current && !isSelectingEmoji) {
            emojiPickerWrapperRef.current.style.display = "none";
        }
    }

    //Check if mobile layout should be used every time the window width changes
    window.addEventListener('resize', ()=>{
        setIsMobile(window.innerWidth < 996);
    })

    function backToContacts(){
        if (contactListRef.current && backButtonRef.current && chatWrapperRef.current) {
            
            contactListRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "hidden";
            if (isMobile){
                chatWrapperRef.current.style.display = "none";
            }
            navigate("/", {replace: true});
        }
    }
    
    function changeChatType(){
        if (chatType === "individualChat") {
            setChatType("groupChat")
        } else if (chatType === "groupChat"){
            setChatType("individualChat")
        }
        backToContacts();
    }

    return(
        <AuthIdContext.Provider value={[authId, setAuthId]}>
        <AuthUserContext.Provider value={authUser}>
        <IsMobileContext.Provider value={isMobile}>
        <ContactListRefContext.Provider value={[contactListRef, chatWrapperRef, backButtonRef]}>
        <FontStylePopupContext.Provider value={{refs: [chatInputRef, fontStylePopupRef], states: [selectedText, setSelectedText], actions: toggleFontStylePopup}}>
        <EmojiPickerContext.Provider value={{refs: emojiPickerWrapperRef, states: [isSelectingEmoji, setIsSelectingEmoji], actions: closeEmojiPicker}}>
        <ChatTypeContext.Provider value={{state: [chatType, setChatType], actions: [backToContacts, changeChatType]}}>
            <div className="container-fluid h-100" onMouseUp={()=>{toggleFontStylePopup(); closeEmojiPicker();}}>
                <div className="row">
                        <Toolbar/>
                </div>
                <div className="row">
                        <Sidebar/>
                    <div id="body">
                        <Body/>
                    </div>
                </div>
            </div>
        </ChatTypeContext.Provider>
        </EmojiPickerContext.Provider>
        </FontStylePopupContext.Provider>
        </ContactListRefContext.Provider>
        </IsMobileContext.Provider>
        </AuthUserContext.Provider>
        </AuthIdContext.Provider>
    )
}