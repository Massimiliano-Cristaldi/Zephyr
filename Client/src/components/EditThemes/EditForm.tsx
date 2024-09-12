import { useState } from "react";
import { hslStringToHex, hexToHsl, hexToHslString } from "../../utils";

export default function EditForm(){

    // TODO: Implement a way to save the property to local storage
    // const styles = document.documentElement;
    // const root = styles.style;
    // console.log(getComputedStyle(styles).getPropertyValue("--default_font_color"));
    // root.setProperty("--default_font_color", "black");


    // const savedTheme = JSON.parse(window.localStorage.getItem("theme") || "");

        // function saveTheme(){
    //     window.localStorage.setItem("theme", JSON.stringify({...newTheme}));
    // }

    const [newTheme, setNewTheme] = useState({
        accents: "#7746a4",
        defaultFontColor: "#eef0f2",
    });

    function handleColorInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setNewTheme({...newTheme, [e.target.name]: e.target.value})
    }    

// rgb(238, 240, 242)

    return(
        <div className="d-flex flex-column gap-3 text-success">
            Pippo
            <br />
                <input type="color" name="accents" id="accents" onBlur={handleColorInputChange} defaultValue={newTheme.accents}/>
                <input type="color" name="defaultFontColor" id="default-font-color" onBlur={handleColorInputChange}/>
        </div>
    )
}