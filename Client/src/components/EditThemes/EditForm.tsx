import { useState } from "react";
import { defaultTheme, hexToHslString, getLightnessFromHex, formatColorProperty } from "../../ColorTools";
import { StyleProperties } from "../../types";
import "./EditForm.css";

export default function EditForm(){

    const [colorProperties, setColorProperties] = useState<StyleProperties>(defaultTheme);

    function setProperty(e: React.ChangeEvent<HTMLInputElement>){
        if (e.target.name === "iconBg") {
            //This constant calculates the hsl lightness adjustment for button:hovers automatically, giving a darker shade
            //if the color is light and a lighter shade if the color is dark 
            const lightnessAdjust = getLightnessFromHex(e.target.value) as number <= 20 ? 10 : -10;
            setColorProperties({...colorProperties,
                iconBg: e.target.value,
                iconHoverBg: hexToHslString(e.target.value, lightnessAdjust) as string
            });
        } else {
            setColorProperties({...colorProperties, [e.target.name]: e.target.value});
        }
        console.log("Value of colorProperties changed");
        
    }

    function saveThemeToLocalStorage(){
        window.localStorage.setItem("theme", JSON.stringify(colorProperties));
        console.log("Theme saved to local storage");
    }

    function resetDefaultTheme(){
        setColorProperties(defaultTheme);
        saveThemeToLocalStorage();
        console.log("Default theme restored");
    }
    
    return(
        <div id="editThemeWrapper">
            {Object.keys(colorProperties).map((el)=>(
                el !== "iconHoverBg" &&
                <div key={el}>
                    <label htmlFor={el} className="text-black">{formatColorProperty(el)}</label>
                    <input type="color"
                    name={el}
                    id={el}
                    onBlur={setProperty}
                    defaultValue={colorProperties[el]}/>
                </div>
            ))}
            <button className="text-black" onClick={saveThemeToLocalStorage}>
                Apply changes
            </button>
            <button className="text-black" onClick={resetDefaultTheme}>
                Reset default theme
            </button>
            <button className="text-black" onClick={()=>{console.log(colorProperties)}}>
                Log colorProperties
            </button>
            <button className="text-black" onClick={()=>{console.log(window.localStorage.getItem("theme"))}}>
                Log localStorage
            </button>
        </div>
    )
}