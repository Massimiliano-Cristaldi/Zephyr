import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ContactListRefContext, AuthUserContext, getCaretCoordinates, FontStylePopupContext,IsMobileContext, AuthIdContext, EmojiPickerContext, ChatTypeContext, ContactsContext, MessageCountContext, ModalsContext } from "../utils.tsx";
import { User } from "../types";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Body from "./Chat/Body";
import "../css/StyleVariables.css";
import "../css/index.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Layout(){

    const navigate = useNavigate();
    const params = useParams();

    //Modals
    const addContactRef = useRef<HTMLDivElement>(null);
    const createGroupRef = useRef<HTMLDivElement>(null);
    const editProfileRef = useRef<HTMLDivElement>(null);
    const viewProfileRef = useRef<HTMLDivElement>(null);
    const groupDetailsWrapperRef = useRef<HTMLDivElement>(null);

    const contactListRef = useRef<HTMLDivElement>(null);
    const chatWrapperRef = useRef<HTMLDivElement>(null);
    const backButtonRef = useRef<HTMLElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const fontStylePopupRef = useRef<HTMLDivElement>(null);
    const emojiPickerWrapperRef = useRef<HTMLDivElement>(null);

    const [authId, setAuthId] = useState<number>(1);
    const [authUser, setAuthUser] = useState<User>({
        id: 1,
        username: "Loading...",
        phone_number: 0,
        icon_url: null
    });
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 996);
    const [chatType, setChatType] = useState<string>("individualChat");
    const [contacts, setContacts] = useState<User[] | []>([]);
    const [groups, setGroups] = useState<any>([]);
    const [sessionMessageCount, setSessionMessageCount] = useState(0);
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

    //Fetch contact list and group list
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/contactlist/${authUser.id}`)
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setContacts(response.data);
            } catch (err) {
                setContacts([]);
                console.error(err);
            }
            
            try {
                const response = await axios.get(`http://localhost:8800/groupchatlist/${authUser.id}`)
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setGroups(response.data);
            } catch (err) {
                setGroups([]);
                console.error(err);
            }
        }
        fetchData();
    }, [authUser.id, sessionMessageCount, params])

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

    //Check if mobile layout should be used every time the window width changes
    window.addEventListener('resize', ()=>{
        setIsMobile(window.innerWidth < 996);
    })

    //Make font style popup dialog appear/disappear when selecting/deselecting text in the chat input
    //The function appears here because the mouseup event should trigger when the mouse button is released anywhere
    function toggleFontStylePopup(){
        const input = chatInputRef.current;
        const position = input?.selectionStart;
        const selection = window.getSelection();
        if (input && position !== null && position !== undefined && selection?.focusNode){
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

    //Go back to contact list (on mobile, where opening a chat hides the contact list)
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
    
    //Toggle between individual chat and group chat state
    function changeChatType(){
        if (chatType === "individualChat") {
            setChatType("groupChat")
        } else if (chatType === "groupChat"){
            setChatType("individualChat")
        }
        backToContacts();
    }

    function closeAllModals(){
        const allModals = [addContactRef, createGroupRef, editProfileRef, viewProfileRef, groupDetailsWrapperRef];
        allModals.forEach((ref)=>{
            if (ref.current) {
                ref.current.style.display = "none";
            }
        })
    }

    return(
        <AuthIdContext.Provider value={[authId, setAuthId]}>
        <AuthUserContext.Provider value={authUser}>
        <IsMobileContext.Provider value={isMobile}>
        <ContactListRefContext.Provider value={[contactListRef, chatWrapperRef, backButtonRef]}>
        <FontStylePopupContext.Provider value={{refs: [chatInputRef, fontStylePopupRef], states: [selectedText, setSelectedText], actions: toggleFontStylePopup}}>
        <EmojiPickerContext.Provider value={{refs: emojiPickerWrapperRef, states: [isSelectingEmoji, setIsSelectingEmoji], actions: closeEmojiPicker}}>
        <ChatTypeContext.Provider value={{state: [chatType, setChatType], actions: [backToContacts, changeChatType]}}>
        <MessageCountContext.Provider value={[sessionMessageCount, setSessionMessageCount]}>
        <ContactsContext.Provider value={[contacts, groups]}>
        <ModalsContext.Provider value={{refs: [addContactRef, createGroupRef, editProfileRef, viewProfileRef, groupDetailsWrapperRef], actions: closeAllModals}}>
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
        </ModalsContext.Provider>
        </ContactsContext.Provider>
        </MessageCountContext.Provider>
        </ChatTypeContext.Provider>
        </EmojiPickerContext.Provider>
        </FontStylePopupContext.Provider>
        </ContactListRefContext.Provider>
        </IsMobileContext.Provider>
        </AuthUserContext.Provider>
        </AuthIdContext.Provider>
    )
}