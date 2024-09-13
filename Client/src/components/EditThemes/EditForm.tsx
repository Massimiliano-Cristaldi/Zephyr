import { useState, useEffect, useContext } from "react";
import { defaultTheme, hexToHslString, getLightnessFromHex, formatColorProperty } from "../../ColorTools";
import { ContactListRefContext, isMobile } from "../../utils";
import { StyleProperties } from "../../types";
import "./EditForm.css";

export default function EditForm(){

    const [currentTheme, setCurrentTheme] = useState<StyleProperties>(()=>{
        const savedTheme = window.localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    });
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext);

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

    //TODO: Add a popup menu to confirm reset, and maybe one to confirm save
    function resetDefaultTheme(){
        setCurrentTheme(defaultTheme);
        saveTheme(defaultTheme);
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
            <div id="editThemeButtonWrapper">
                <button onClick={()=>saveTheme(currentTheme)}>
                    Apply changes
                </button>
                <button onClick={resetDefaultTheme}>
                    Reset default theme
                </button>
                <button onClick={()=>{console.log(currentTheme)}}>
                    Log currentTheme
                </button>
                <button onClick={()=>{console.log(window.localStorage.getItem("theme"))}}>
                    Log localStorage
                </button>
            </div>
        </div>
    )
}