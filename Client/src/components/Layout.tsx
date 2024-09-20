import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Body from "./Chat/Body";
import { ContactListRefContext, AuthUserContext, getCaretCoordinates, FontStylePopupContext } from "../utils";
import "../StyleVariables.css";
import "../index.css";

export default function Layout(){

    const contactListRef = useRef<HTMLDivElement>(null);
    const chatWrapperRef = useRef<HTMLDivElement>(null);
    const backButtonRef = useRef<HTMLElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const fontStylePopupRef = useRef<HTMLDivElement>(null);
    const [selectedText, setSelectedText] = useState<string>("");

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
    function toggleFontStylePopup(){
        const input = chatInputRef.current;
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
        <AuthUserContext.Provider value={1}>
        <ContactListRefContext.Provider value={[contactListRef, chatWrapperRef, backButtonRef]}>
        <FontStylePopupContext.Provider value={{refs: [chatInputRef, fontStylePopupRef], states: [selectedText, setSelectedText], actions: [toggleFontStylePopup]}}>
        <div className="container-fluid h-100" onMouseUp={toggleFontStylePopup}>
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
        </FontStylePopupContext.Provider>
        </ContactListRefContext.Provider>
        </AuthUserContext.Provider>
    )
}