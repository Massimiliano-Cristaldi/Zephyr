import { useState, useEffect, useContext, useRef, RefObject } from "react";
import ConfirmPopup from "./ConfirmPopup";
import { defaultTheme, hexToHslString, getLightnessFromHex, formatColorProperty } from "../../ColorTools";
import { ContactListRefContext, isMobile, fonts } from "../../utils";
import { StyleProperties } from "../../types";
import "./EditForm.css";

export default function EditForm(){

    const [currentTheme, setCurrentTheme] = useState<StyleProperties>(()=>{
        const savedTheme = window.localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    });
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);
    const confirmApplyRef = useRef<HTMLDivElement>(null);
    const confirmResetRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if (isMobile()) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        }
    }, [])

    function setProperty(e: React.ChangeEvent<HTMLInputElement>){
        if (e.target.name === "iconBg") {
            //This constant calculates the hsl lightness adjustment for button:hovers automatically, giving
            //a darker shade if the color is light and a lighter shade if the color is dark 
            const lightnessAdjust = getLightnessFromHex(e.target.value) as number <= 20 ? 10 : -10;
            setCurrentTheme({...currentTheme,
                iconBg: e.target.value,
                iconHoverBg: hexToHslString(e.target.value, lightnessAdjust) as string
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
        ref.current!.style.display = "flex";
    }
    
    //TODO: Add the ability to change border radius and font family
    return(
        <div id="editThemeWrapper">
            {Object.keys(currentTheme).map((el)=>(
                el !== "iconHoverBg" &&
                <div key={el}>
                    <label htmlFor={el}>{formatColorProperty(el)}</label>
                    <input type="color"
                    name={el}
                    id={el}
                    onBlur={setProperty}
                    defaultValue={currentTheme[el]}/>
                </div>
            ))}
            <div id="editFontAndBorder">
                Font
                <select name="fontFamily" id="" aria-placeholder="Choose font">
                    {fonts.map((el)=>(<option value={el} style={{fontFamily: el}}>{el}</option>))}
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