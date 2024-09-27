import { useState, useEffect, useContext, useRef, RefObject } from "react";
import ConfirmPopup from "./ConfirmPopup";
import { defaultTheme, hexToHslString, getLightnessFromHex, formatColorProperty } from "../../ColorTools";
import { ContactListRefContext, fonts, IsMobileContext } from "../../utils";
import { StyleProperties } from "../../types";
import "../../css/EditForm.css";

export default function EditForm(){

    const isMobile = useContext(IsMobileContext);
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const confirmApplyRef = useRef<HTMLDivElement>(null);
    const confirmResetRef = useRef<HTMLDivElement>(null);
    const [currentTheme, setCurrentTheme] = useState<StyleProperties>(()=>{
        const savedTheme = window.localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    });

    useEffect(()=>{
        if (isMobile) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        }
    }, [])

    function setProperty(e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>){
        if (e.target.name === "iconBg"){
            const lightnessAdjust = getLightnessFromHex(e.target.value) as number <= 20 ? 10 : -10;
            setCurrentTheme({...currentTheme,
                iconBg: e.target.value,
                iconHoverBg: hexToHslString(e.target.value, lightnessAdjust) as string
            });
        } else if (e.target.name === "senderMessageBg"){
            const replyLightnessAdjust = getLightnessFromHex(e.target.value) as number <= 90 ? 10 : -10;
            const borderLightnessAdjust = getLightnessFromHex(e.target.value) as number <= 30 ? 20 : -20;
            setCurrentTheme({...currentTheme,
                senderMessageBg: e.target.value,
                senderReplyBg: hexToHslString(e.target.value, replyLightnessAdjust) as string,
                senderMessageDropdownBorder: hexToHslString(e.target.value, borderLightnessAdjust) as string
            });
        } else if (e.target.name === "recipientMessageBg"){
            const replyLightnessAdjust = getLightnessFromHex(e.target.value) as number <= 90 ? 10 : -10;
            const borderLightnessAdjust = getLightnessFromHex(e.target.value) as number <= 30 ? 20 : -20;
            setCurrentTheme({...currentTheme,
                recipientMessageBg: e.target.value,
                recipientReplyBg: hexToHslString(e.target.value, replyLightnessAdjust) as string,
                recipientMessageDropdownBorder: hexToHslString(e.target.value, borderLightnessAdjust) as string
            });
        } else {
            setCurrentTheme({...currentTheme, [e.target.name]: e.target.value});
        }
    }

    function saveTheme(theme:StyleProperties){
        window.localStorage.setItem("theme", JSON.stringify(theme));
        window.location.reload();
    }

    function showPopup(ref:RefObject<HTMLDivElement>){
        if (ref.current){
            ref.current.style.display = "flex";
        }
    }

    const excludeTheseProperties = ["iconHoverBg", "favoriteFont", "messageBorderRadius", "recipientReplyBg", "senderReplyBg", "senderMessageDropdownBorder", "recipientMessageDropdownBorder"];
    
    return(
        <div id="editThemeWrapper">
            {Object.keys(currentTheme).map((el)=>(
                !excludeTheseProperties.includes(el) &&
                <div key={el}>
                    <label htmlFor={el}>{formatColorProperty(el)}</label>
                    <input type="color"
                    name={el}
                    id={el}
                    onBlur={setProperty}
                    defaultValue={currentTheme[el]}/>
                </div>
            ))}
            <div className="editFontAndBorder">
                Font
                <select name="favoriteFont" id="favoriteFont" defaultValue={currentTheme.favoriteFont} onChange={setProperty}>
                    {fonts.map((el)=>(<option value={el} key={el} style={{fontFamily: el}}>{el}</option>))}
                </select>
            </div>
            <div className="editFontAndBorder">
                Message box borders
                <select name="messageBorderRadius" defaultValue={currentTheme.messageBorderRadius} onChange={setProperty}>
                    <option value="0px">Squared</option>
                    <option value="10px">Rounded</option>
                </select>
            </div>
            <div id="editThemeButtonWrapper">
                <div>
                    <button onClick={()=>{showPopup(confirmApplyRef)}}>
                        Apply changes
                    </button>
                    <ConfirmPopup popupRef={confirmApplyRef} confirmAction={()=>{saveTheme(currentTheme)}}/>
                </div>
                <div>
                    <button onClick={()=>{showPopup(confirmResetRef)}}>
                        Reset default theme
                    </button>
                    <ConfirmPopup popupRef={confirmResetRef} confirmAction={()=>{saveTheme(defaultTheme)}}/>
                </div>
            </div>
        </div>
    )
}